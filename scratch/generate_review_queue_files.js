const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;
  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  const l1Words = WORDS.filter(w => w.level === 1);

  // Load LEVEL_MANUAL_OVERRIDES
  const buildScript = fs.readFileSync(path.join(PROJECT_ROOT, 'scripts', 'buildOverridesAndVerify.cjs'), 'utf8');
  const start = buildScript.indexOf('const LEVEL_MANUAL_OVERRIDES = {');
  const end = buildScript.indexOf('function autoDifferentiateSense');
  const manualOverridesCode = buildScript.slice(start, end);
  const LEVEL_MANUAL_OVERRIDES = (new Function(`${manualOverridesCode}; return LEVEL_MANUAL_OVERRIDES;`))();
  const l1ManualMap = LEVEL_MANUAL_OVERRIDES[1] || {};

  const TAIWAN_VOCAB_MAP = {
    '軟件': '軟體', '程序的': '程式的', '程序': '程式', '出租車': '計程車',
    '公共汽車': '公車', '視頻': '影片', '打印': '列印', '內存': '記憶體',
    '網絡': '網路', '信箱': '郵箱', '信息': '資訊', '硬盤': '硬碟',
    '鼠標': '滑鼠', '數碼': '數位', '屏幕': '螢幕', '服務器': '伺服器',
    '智能': '智慧型', '幼兒園': '幼稚園', '塑料': '塑膠', '黃油': '奶油',
    '吐司': '吐司', '便當': '便當', '黃瓜': '小黃瓜', '菠蘿': '鳳梨',
    '三文魚': '鮭魚', '金槍魚': '鮪魚', '方便面': '泡麵', '公交車': '公車',
    '地鐵': '捷運', '自行車': '腳踏車', '摩托車': '機車',
  };

  function applyTaiwanTerms(str) {
    if (!str) return str;
    let res = str;
    Object.entries(TAIWAN_VOCAB_MAP).forEach(([cn, tw]) => {
      res = res.replace(new RegExp(cn, 'g'), tw);
    });
    return res;
  }

  function normalizeChineseMeaning(meaning) {
    if (!meaning) return '';
    return meaning.trim().replace(/\s+/g, ' ').replace(/[，、；;。.]$/g, '').trim();
  }

  function disambiguateWordSense(word, pos, eng, orig, index, total, lexicalFile) {
    if (word === 'act') {
      if (eng.includes('legal document') || eng.includes('legislative')) return { meaningZhTW: '法案；條例', isSuspicious: false };
      if (eng.includes('something that people do') || eng.includes('cause to happen')) return { meaningZhTW: '行動；行為', isSuspicious: false };
      if (eng.includes('subdivision of a play')) return { meaningZhTW: '（戲劇的）幕', isSuspicious: false };
      if (eng.includes('perform an action')) return { meaningZhTW: '行動；採取行動', isSuspicious: false };
      if (eng.includes('behave in a certain manner')) return { meaningZhTW: '表現；舉止', isSuspicious: false };
      if (eng.includes('play a role')) return { meaningZhTW: '扮演；演戲', isSuspicious: false };
    }
    if (word === 'action') {
      if (eng.includes('something done')) return { meaningZhTW: '行動；行為', isSuspicious: false };
      if (eng.includes('state of being active')) return { meaningZhTW: '活動；運作', isSuspicious: false };
      if (eng.includes('military engagement')) return { meaningZhTW: '軍事行動；戰鬥', isSuspicious: false };
    }
    if (word === 'bank') {
      if (eng.includes('financial institution') || eng.includes('accepts deposits')) return { meaningZhTW: '銀行', isSuspicious: false };
      if (eng.includes('sloping land') || eng.includes('beside a body of water')) return { meaningZhTW: '河岸；堤岸', isSuspicious: false };
      if (eng.includes('container') && eng.includes('money')) return { meaningZhTW: '存錢筒；撲滿', isSuspicious: false };
      if (eng.includes('deposit money')) return { meaningZhTW: '把（錢）存入銀行', isSuspicious: false };
      if (eng.includes('do business with')) return { meaningZhTW: '在（銀行）開戶往來', isSuspicious: false };
    }
    if (word === 'bear') {
      if (eng.includes('mammal') || eng.includes('carnivore')) return { meaningZhTW: '熊', isSuspicious: false };
      if (eng.includes('endure') || eng.includes('unpleasant')) return { meaningZhTW: '忍受；承受', isSuspicious: false };
      if (eng.includes('support') || eng.includes('hold up')) return { meaningZhTW: '支撐；承受重量', isSuspicious: false };
      if (eng.includes('have or contain') || eng.includes('feature')) return { meaningZhTW: '帶有；帶有...特徵', isSuspicious: false };
    }
    return null;
  }

  function translateByPattern(word, pos, eng, orig, lexicalFile) {
    if (eng.includes('quality of being able to perform')) return '能力；本領';
    if (eng.includes('possession of the qualities') && eng.includes('mental')) return '才能；才智';
    if (eng.includes('imprecise but fairly close to correct')) return '大約；大概';
    if (eng.includes('all around or on all sides')) return '到處；周圍';
    if (eng.includes('in or to a foreign country')) return '在國外；到國外';
    if (eng.includes('a person who') || eng.includes('someone who')) {
      let cleanOrig = orig.split('/')[0].split(';')[0].trim();
      if (cleanOrig.endsWith('人') || cleanOrig.endsWith('員') || cleanOrig.endsWith('家')) return cleanOrig;
      return cleanOrig + '（人）';
    }
    if (eng.includes('a device') || eng.includes('an instrument') || eng.includes('a tool')) {
      return orig.split('/')[0].split(';')[0].trim();
    }
    return null;
  }

  function adaptOriginalMeaningForSense(word, pos, originalMeaning, english, senseIndex, totalSenses) {
    if (!originalMeaning) return '未知';
    let parts = originalMeaning.split(/[\/,;]/).map((p) => p.trim()).filter(Boolean);
    if (totalSenses === 1) return parts.join('；');
    if (parts.length > senseIndex) return parts[senseIndex];
    return parts[0];
  }

  function translateSense(def, wordObj, index, totalSenses) {
    const senseId = def.id;
    if (l1ManualMap[senseId]) {
      const ov = l1ManualMap[senseId];
      return typeof ov === 'string' ? ov : ov.meaningZhTW;
    }
    const english = def.englishDefinition || def.definition || '';
    const pos = def.partOfSpeechLabel || def.partOfSpeech || '';
    const normEng = english.toLowerCase().trim();
    const wordLower = wordObj.word.toLowerCase();

    const disambiguation = disambiguateWordSense(wordLower, pos, normEng, wordObj.meaning, index, totalSenses, def.lexicalFile);
    if (disambiguation) return disambiguation.meaningZhTW;

    const patternMeaning = translateByPattern(wordLower, pos, normEng, wordObj.meaning, def.lexicalFile);
    if (patternMeaning) return patternMeaning;

    return adaptOriginalMeaningForSense(wordLower, pos, wordObj.meaning, normEng, index, totalSenses);
  }

  function classifyMergedGroup(g) {
    const normDefs = g.englishDefinitions.map(d => d.toLowerCase());
    const domainKeywords = ['financial', 'bank', 'money', 'legal', 'statute', 'court', 'military', 'war', 'medical', 'disease', 'nautical', 'ship', 'geometry', 'mathematics', 'police', 'informer', 'game', 'sport', 'slang'];
    
    let domainMismatch = false;
    for (let i = 0; i < normDefs.length; i++) {
      for (let j = i + 1; j < normDefs.length; j++) {
        const d1 = normDefs[i];
        const d2 = normDefs[j];
        domainKeywords.forEach(kw => {
          if ((d1.includes(kw) && !d2.includes(kw)) || (!d1.includes(kw) && d2.includes(kw))) {
            domainMismatch = true;
          }
        });
      }
    }

    if (domainMismatch) return 'CLEAR_OVER_MERGE';

    let maxLength = 0;
    let minLength = Infinity;
    normDefs.forEach(d => {
      maxLength = Math.max(maxLength, d.length);
      minLength = Math.min(minLength, d.length);
    });

    if (maxLength - minLength > 80) return 'POSSIBLE_OVER_MERGE';
    return 'SAFE_DUPLICATE';
  }

  // Suggest short Taiwan Traditional Chinese meanings for distinct concepts in a group
  function suggestDifferentiatedMeanings(g) {
    const suggestions = [];
    g.englishDefinitions.forEach((eng, idx) => {
      const norm = eng.toLowerCase();
      let sug = g.meaningZhTW;

      if (g.word === 'bank') {
        if (norm.includes('financial') || norm.includes('deposits')) sug = '銀行';
        else if (norm.includes('sloping land') || norm.includes('water')) sug = '河岸；堤岸';
        else if (norm.includes('container') || norm.includes('money')) sug = '存錢筒；撲滿';
      } else if (g.word === 'bread') {
        if (norm.includes('food made from dough') || norm.includes('flour')) sug = '麵包';
        else if (norm.includes('money') || norm.includes('cash')) sug = '錢財；鈔票 (口語)';
      } else if (g.word === 'business') {
        if (norm.includes('commercial') || norm.includes('trade')) sug = '商業；生意';
        else if (norm.includes('affair') || norm.includes('concern')) sug = '事務；事情';
      } else if (g.word === 'car') {
        if (norm.includes('motor vehicle') || norm.includes('automotive')) sug = '汽車；轎車';
        else if (norm.includes('railway') || norm.includes('train')) sug = '(火車) 車廂';
        else if (norm.includes('elevator') || norm.includes('cable')) sug = '(電梯) 廂體';
      } else if (g.word === 'case') {
        if (norm.includes('instance') || norm.includes('occurrence')) sug = '具體情況；實例';
        else if (norm.includes('lawsuit') || norm.includes('court')) sug = '訴訟案；案件';
        else if (norm.includes('container') || norm.includes('box')) sug = '外殼；箱子';
      } else if (g.word === 'check') {
        if (norm.includes('bank check') || norm.includes('written order')) sug = '支票';
        else if (norm.includes('inspection') || norm.includes('verification')) sug = '檢查；核對';
        else if (norm.includes('mark') || norm.includes('symbol')) sug = '勾號；記號';
      } else if (g.word === 'close') {
        if (norm.includes('near') || norm.includes('proximity')) sug = '靠近的；親近的';
        else if (norm.includes('dense') || norm.includes('compact')) sug = '緊密的；密集的';
      } else if (g.word === 'dig') {
        if (norm.includes('archeological')) sug = '考古發掘地';
        else if (norm.includes('remark') || norm.includes('sarcasm')) sug = '挖苦；嘲諷 (口語)';
        else if (norm.includes('gouge') || norm.includes('hole')) sug = '凹痕；坑洞';
      } else if (g.word === 'grass') {
        if (norm.includes('herbage') || norm.includes('lawn')) sug = '草；草坪';
        else if (norm.includes('informer') || norm.includes('police')) sug = '線人；告密者 (俚語)';
      } else if (g.word === 'hear') {
        if (norm.includes('perceive sound')) sug = '聽見；聽到';
        else if (norm.includes('judicial') || norm.includes('court')) sug = '審理；聽審';
        else if (norm.includes('aware') || norm.includes('inform')) sug = '得知；聽說';
      } else {
        // Generic domain-aware fallback suggestion
        if (norm.includes('money') || norm.includes('financial')) sug = `${g.meaningZhTW} (財務/金額)`;
        else if (norm.includes('police') || norm.includes('informer')) sug = `${g.meaningZhTW} (俚語/告密)`;
        else if (norm.includes('court') || norm.includes('legal')) sug = `${g.meaningZhTW} (法律/審判)`;
        else if (norm.includes('game') || norm.includes('sport')) sug = `${g.meaningZhTW} (體育/競賽)`;
        else sug = `${g.meaningZhTW} (概念 ${idx + 1})`;
      }

      suggestions.push({
        senseId: g.sourceSenseIds[idx],
        english: eng,
        suggestedZhTW: sug,
      });
    });
    return suggestions;
  }

  function explainOverMergeReason(g) {
    const defs = g.englishDefinitions.join(' | ').toLowerCase();
    if (defs.includes('financial') && (defs.includes('river') || defs.includes('sloping'))) {
      return 'Merges financial institution sense with river bank slope sense.';
    }
    if (defs.includes('money') || defs.includes('cash')) {
      return 'Merges literal item sense with informal/slang money sense.';
    }
    if (defs.includes('police') || defs.includes('informer')) {
      return 'Merges common everyday noun sense with police informer slang sense.';
    }
    if (defs.includes('court') || defs.includes('judicial') || defs.includes('lawsuit')) {
      return 'Merges general occurrence/meaning with formal legal/court sense.';
    }
    if (defs.includes('railway') || defs.includes('train') || defs.includes('vehicle')) {
      return 'Merges distinct mechanical/transportation sub-structures under single general noun.';
    }
    return 'Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.';
  }

  function determineMergeRecommendation(g) {
    const defs = g.englishDefinitions;
    if (defs.length === 2) return 'SPLIT both senses into distinct meanings.';
    return `KEEP synonymous senses merged; SPLIT distinct domain senses (total ${defs.length} senses).`;
  }

  // Collect all merged groups
  const clearGroups = [];
  const possibleGroups = [];

  l1Words.forEach(word => {
    const entry = getWordDefinitions(word.id);
    if (!entry) return;
    const primaryDefs = entry.rawPrimaryDefinitions || entry.primaryDefinitions || [];
    if (primaryDefs.length === 0) return;

    const keyMap = new Map();
    primaryDefs.forEach((def, index) => {
      const meaningZhTW = translateSense(def, word, index, primaryDefs.length);
      const cleanMeaning = applyTaiwanTerms(meaningZhTW);
      const posKey = def.partOfSpeechLabel || def.partOfSpeech || 'other';
      const normZh = normalizeChineseMeaning(cleanMeaning);
      const key = normZh ? `${posKey}:${normZh}` : `${posKey}:raw:${def.id}`;

      if (!keyMap.has(key)) {
        const group = {
          wordId: word.id,
          word: word.word,
          pos: posKey,
          meaningZhTW: cleanMeaning,
          primarySenseId: def.id,
          sourceSenseIds: [def.id],
          englishDefinitions: [def.englishDefinition || def.definition],
        };
        keyMap.set(key, group);
      } else {
        const existing = keyMap.get(key);
        existing.sourceSenseIds.push(def.id);
        existing.englishDefinitions.push(def.englishDefinition || def.definition);
      }
    });

    keyMap.forEach(g => {
      if (g.sourceSenseIds.length > 1) {
        const c = classifyMergedGroup(g);
        if (c === 'CLEAR_OVER_MERGE') clearGroups.push(g);
        else if (c === 'POSSIBLE_OVER_MERGE') possibleGroups.push(g);
      }
    });
  });

  console.log(`Extracted CLEAR_OVER_MERGE groups: ${clearGroups.length}`);
  console.log(`Extracted POSSIBLE_OVER_MERGE groups: ${possibleGroups.length}`);

  // Build review table rows for all CLEAR_OVER_MERGE groups
  const queueEntries = clearGroups.map((g, idx) => {
    const suggestions = suggestDifferentiatedMeanings(g);
    const explanation = explainOverMergeReason(g);
    const mergeRec = determineMergeRecommendation(g);

    return {
      index: idx + 1,
      word: g.word,
      wordId: g.wordId,
      level: 1,
      pos: g.pos,
      currentMeaningZhTW: g.meaningZhTW,
      sourceSenseIds: g.sourceSenseIds,
      englishDefinitions: g.englishDefinitions,
      suggestions,
      explanation,
      mergeRecommendation: mergeRec,
      reviewStatus: 'NEEDS_REVIEW',
    };
  });

  // --- 1. GENERATE reports/zhTW-level1-review-queue.csv ---
  // CSV Headers: index,word,wordId,level,partOfSpeech,currentMeaningZhTW,senseId,englishDefinition,suggestedMeaningZhTW,explanation,mergeRecommendation,reviewStatus,decision,finalMeaningZhTW,reviewerNotes
  const csvRows = [
    [
      'index', 'word', 'wordId', 'level', 'partOfSpeech', 'currentMeaningZhTW',
      'senseId', 'englishDefinition', 'suggestedMeaningZhTW', 'explanation',
      'mergeRecommendation', 'reviewStatus', 'decision', 'finalMeaningZhTW', 'reviewerNotes'
    ].join(',')
  ];

  queueEntries.forEach(item => {
    item.sourceSenseIds.forEach((sid, sIdx) => {
      const eng = item.englishDefinitions[sIdx] || '';
      const sug = item.suggestions[sIdx] ? item.suggestions[sIdx].suggestedZhTW : '';
      
      const row = [
        item.index,
        `"${item.word}"`,
        `"${item.wordId}"`,
        item.level,
        `"${item.pos}"`,
        `"${item.currentMeaningZhTW.replace(/"/g, '""')}"`,
        `"${sid}"`,
        `"${eng.replace(/"/g, '""')}"`,
        `"${sug.replace(/"/g, '""')}"`,
        `"${item.explanation.replace(/"/g, '""')}"`,
        `"${item.mergeRecommendation.replace(/"/g, '""')}"`,
        `"${item.reviewStatus}"`,
        '""', // decision (empty)
        '""', // finalMeaningZhTW (empty)
        '""'  // reviewerNotes (empty)
      ].join(',');

      csvRows.push(row);
    });
  });

  // Add UTF-8 BOM \uFEFF for Excel compatibility
  const csvContent = '\uFEFF' + csvRows.join('\n');
  const csvPath = path.join(PROJECT_ROOT, 'reports', 'zhTW-level1-review-queue.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`Wrote ${csvPath} (${fs.statSync(csvPath).size} bytes)`);

  // --- 2. GENERATE reports/zhTW-level1-review-queue.md ---
  let md = `# Level 1 Learner Meaning Quality Review Queue

**Date:** 2026-09-27  
**Scope:** Level 1 CLEAR_OVER_MERGE Groups (${queueEntries.length} Groups Total)  
**Goal:** Human-in-the-loop quality review of over-merged WordNet senses before promoting overrides to production.

---

## Instructions for Reviewers

- **Review Files:**
  - CSV Format: \`reports/zhTW-level1-review-queue.csv\` (opens natively in Microsoft Excel with UTF-8 encoding).
  - Markdown Format: \`reports/zhTW-level1-review-queue.md\` (interactive visual review).
- **Decision Column Values:**
  - \`APPROVE\`: Promote suggested Taiwan Traditional Chinese meanings into production override file (\`src/data/wordDefinitionsZhTW_L1_overrides.js\`) with \`status: "verified"\`.
  - \`REVISE\`: Use custom translation provided in \`finalMeaningZhTW\` column.
  - \`KEEP_MERGED\`: Keep current unified Chinese meaning (the senses are synonymous enough for Level 1 learners).
  - \`SKIP\`: Defer decision.

---

## Detailed Review Cards (First 30 CLEAR_OVER_MERGE Groups)

`;

  queueEntries.slice(0, 30).forEach(item => {
    md += `### ${item.index}. Word: **${item.word}** (\`${item.wordId}\`)
- **Level:** ${item.level} | **POS:** \`${item.pos}\` | **Current Meaning:** \`${item.currentMeaningZhTW}\`
- **Over-merge Explanation:** ${item.explanation}
- **Merge Recommendation:** ${item.mergeRecommendation}
- **Review Status:** \`${item.reviewStatus}\`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
`;
    item.sourceSenseIds.forEach((sid, sIdx) => {
      const eng = item.englishDefinitions[sIdx];
      const sug = item.suggestions[sIdx] ? item.suggestions[sIdx].suggestedZhTW : '';
      md += `| \`${sid}\` | ${eng} | **${sug}** | | | |\n`;
    });
    md += `\n---\n\n`;
  });

  md += `## Complete Level 1 Review Queue Table (${queueEntries.length} Groups)

| # | Word | Word ID | POS | Current Meaning | Senses Count | Over-merge Explanation | Review Status |
|---|---|---|---|---|---|---|---|
`;

  queueEntries.forEach(item => {
    md += `| ${item.index} | **${item.word}** | \`${item.wordId}\` | \`${item.pos}\` | ${item.currentMeaningZhTW} | ${item.sourceSenseIds.length} | ${item.explanation} | \`${item.reviewStatus}\` |\n`;
  });

  const mdPath = path.join(PROJECT_ROOT, 'reports', 'zhTW-level1-review-queue.md');
  fs.writeFileSync(mdPath, md, 'utf8');
  console.log(`Wrote ${mdPath} (${fs.statSync(mdPath).size} bytes)`);
}

main().catch(console.error);
