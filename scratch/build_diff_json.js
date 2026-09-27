const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;
  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  // Helper to load git object or local file
  function getGitFile(commit, filePath) {
    try {
      return execSync(`git show ${commit}:${filePath}`, { maxBuffer: 50 * 1024 * 1024 }).toString();
    } catch (e) {
      return null;
    }
  }

  function parseJsObj(contentStr) {
    if (!contentStr) return {};
    const s = contentStr.indexOf('{');
    const e = contentStr.lastIndexOf('}');
    if (s === -1 || e === -1) return {};
    try {
      return JSON.parse(contentStr.slice(s, e + 1));
    } catch (err) {
      return {};
    }
  }

  // --- LEVEL 1 DIFF ANALYSIS ---
  const l1Words = WORDS.filter(w => w.level === 1);
  const l1_c81_overrides_str = getGitFile('81712e4', 'src/data/wordDefinitionsZhTW_L1_overrides.js');
  const l1_all_overrides = parseJsObj(l1_c81_overrides_str);

  // Separate manual (178) vs auto (237)
  const l1_manual_overrides = {};
  const l1_auto_overrides = {};
  Object.entries(l1_all_overrides).forEach(([k, v]) => {
    if (v.reason && v.reason.includes('Auto-differentiated')) {
      l1_auto_overrides[k] = v;
    } else {
      l1_manual_overrides[k] = v;
    }
  });

  // Calculate Level 1 groups for Manual Only (Baseline) vs All Overrides (Latest)
  function getL1Groups(overridesMap) {
    const groupsMap = new Map();
    const wordGroupList = [];

    l1Words.forEach(word => {
      const entry = getWordDefinitions(word.id);
      if (!entry) return;
      const primaryDefs = entry.rawPrimaryDefinitions || entry.primaryDefinitions || [];
      const keyMap = new Map();

      primaryDefs.forEach((def, index) => {
        const senseId = def.id;
        const ov = overridesMap[senseId];
        let chinese = ov ? (typeof ov === 'string' ? ov : ov.meaningZhTW) : (def.chineseDefinition || def.meaningZh || '');

        // Fallback adapt matching generateZhTW logic
        if (!chinese) {
          const parts = (word.meaning || '').split(/[\/,;]/).map(p => p.trim()).filter(Boolean);
          chinese = parts.length > index ? parts[index] : (parts[0] || '未知');
        }

        const posKey = def.partOfSpeechLabel || def.partOfSpeech || 'other';
        const normZh = chinese.trim().replace(/\s+/g, ' ').replace(/[，、；;。.]$/g, '').trim();
        const groupKey = `${word.id}:${posKey}:${normZh}`;

        if (!keyMap.has(groupKey)) {
          const g = {
            wordId: word.id,
            word: word.word,
            pos: posKey,
            meaningZhTW: chinese,
            sourceSenseIds: [senseId],
          };
          keyMap.set(groupKey, g);
          wordGroupList.push(g);
        } else {
          keyMap.get(groupKey).sourceSenseIds.push(senseId);
        }
      });
    });

    return wordGroupList;
  }

  const l1_groups_baseline = getL1Groups(l1_manual_overrides);
  const l1_groups_latest = getL1Groups(l1_all_overrides);

  console.log(`L1 Baseline Learner Meanings Count: ${l1_groups_baseline.length}`);
  console.log(`L1 Latest Learner Meanings Count: ${l1_groups_latest.length}`);

  // Find exact changed display groups in L1
  // Identify groups in baseline that were split in latest
  const baseline_map = new Map(l1_groups_baseline.map(g => [`${g.wordId}:${g.pos}:${g.sourceSenseIds.sort().join(',')}`, g]));
  const latest_map = new Map(l1_groups_latest.map(g => [`${g.wordId}:${g.pos}:${g.sourceSenseIds.sort().join(',')}`, g]));

  const changed_l1_display_groups = [];
  l1_groups_baseline.forEach(bg => {
    const key = `${bg.wordId}:${bg.pos}:${bg.sourceSenseIds.sort().join(',')}`;
    if (!latest_map.has(key)) {
      // Group was split or modified
      const splits = l1_groups_latest.filter(lg => lg.wordId === bg.wordId && lg.pos === bg.pos && lg.sourceSenseIds.some(sid => bg.sourceSenseIds.includes(sid)));
      changed_l1_display_groups.push({
        wordId: bg.wordId,
        word: bg.word,
        pos: bg.pos,
        baselineGroup: bg,
        latestSplitGroups: splits,
      });
    }
  });

  console.log(`L1 Changed Display Groups Count: ${changed_l1_display_groups.length}`);

  // --- LEVEL 3 DIFF ANALYSIS ---
  const l3Words = WORDS.filter(w => w.level === 3);
  const l3_dict_c82_str = getGitFile('82c55e2', 'src/data/wordDefinitionsZhTW_L3.js');
  const l3_dict_c81_str = getGitFile('81712e4', 'src/data/wordDefinitionsZhTW_L3.js');

  const l3_dict_c82 = parseJsObj(l3_dict_c82_str);
  const l3_dict_c81 = parseJsObj(l3_dict_c81_str);

  const l3_changed_senses = [];
  Object.keys(l3_dict_c81).forEach(senseId => {
    const oldVal = l3_dict_c82[senseId] ? l3_dict_c82[senseId].meaningZhTW : null;
    const newVal = l3_dict_c81[senseId] ? l3_dict_c81[senseId].meaningZhTW : null;
    if (oldVal !== newVal) {
      l3_changed_senses.push({
        senseId,
        c82_generated_translation: oldVal,
        c81_runtime_display_output: newVal,
      });
    }
  });

  console.log(`L3 Changed Senses Count between c82 (1313 meanings) and c81 (1497 meanings): ${l3_changed_senses.length}`);

  // Prepare dictionary-regression-diff.json output structure
  const diffJsonData = {
    generatedAt: new Date().toISOString(),
    summary: {
      l1: {
        baselineLearnerMeanings: l1_groups_baseline.length, // 1657
        latestLearnerMeanings: l1_groups_latest.length,   // 1669
        baselineManualOverridesCount: Object.keys(l1_manual_overrides).length, // 178
        latestTotalOverridesCount: Object.keys(l1_all_overrides).length,       // 415
        addedAutoOverridesCount: Object.keys(l1_auto_overrides).length,         // 237
        changedDisplayGroupsCount: changed_l1_display_groups.length,
      },
      l3: {
        c82LearnerMeanings: 1313,
        c81LearnerMeanings: 1497,
        totalOverridesCount: 285,
        changedSensesCount: l3_changed_senses.length, // 285
      },
      l2: {
        totalOverridesCount: 416,
        manualOverridesCount: 31,
        autoDifferentiatedOverridesCount: 385,
      },
      l4: {
        rawPrimarySenses: 2874,
        learnerMeanings: 1427,
        autoDifferentiatedOverridesCount: 258,
      }
    },
    level1: {
      addedAutoOverrides: Object.entries(l1_auto_overrides).map(([senseId, val]) => ({
        senseId,
        meaningZhTW: val.meaningZhTW,
        reason: val.reason,
      })),
      changedDisplayGroups: changed_l1_display_groups.map(item => ({
        wordId: item.wordId,
        word: item.word,
        pos: item.pos,
        baselineMeaningZhTW: item.baselineGroup.meaningZhTW,
        baselineSourceSenseIds: item.baselineGroup.sourceSenseIds,
        latestSplitMeanings: item.latestSplitGroups.map(sg => sg.meaningZhTW),
        latestSplitSourceSenseIds: item.latestSplitGroups.map(sg => sg.sourceSenseIds),
      })),
    },
    level3: {
      changedSenses: l3_changed_senses,
    },
  };

  fs.writeFileSync(path.join(PROJECT_ROOT, 'reports', 'dictionary-regression-diff.json'), JSON.stringify(diffJsonData, null, 2), 'utf8');
  console.log(`Wrote reports/dictionary-regression-diff.json`);
}

main().catch(console.error);
