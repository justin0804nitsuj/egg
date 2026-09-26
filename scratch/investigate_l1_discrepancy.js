const fs = require('fs');
const path = require('path');

const { WORDS } = require('../src/data/words.js');
const { getWordDefinitions } = require('../src/data/wordDefinitions.js');

const l1Words = WORDS.filter(w => w.level === 1);

// Load current 415 overrides (Setup B)
const setupB_overrides = require('../src/data/wordDefinitionsZhTW_L1_overrides.js').ZH_TW_L1_OVERRIDES;

// Construct Setup A (manual only)
const setupA_overrides = {};
Object.entries(setupB_overrides).forEach(([k, v]) => {
  if (!v.reason.includes('Auto-differentiated')) {
    setupA_overrides[k] = v;
  }
});

function getGroupsForOverrides(overridesMap) {
  const allGroups = [];
  const mergedGroups = [];

  l1Words.forEach(word => {
    const entry = getWordDefinitions(word.id);
    if (!entry || (!entry.primaryDefinitions && !entry.rawPrimaryDefinitions)) return;
    const primaryDefs = entry.rawPrimaryDefinitions || entry.primaryDefinitions;

    const keyMap = new Map();
    primaryDefs.forEach(def => {
      const senseId = def.id;
      const override = overridesMap[senseId];
      const chinese = override ? override.meaningZhTW : (def.chineseDefinition || def.meaningZh || '');
      const posKey = def.partOfSpeechLabel || def.partOfSpeech || 'other';
      const normZh = chinese.trim().replace(/\s+/g, ' ').replace(/[，、；;。.]$/g, '').trim();

      const key = normZh ? `${posKey}:${normZh}` : `${posKey}:raw:${def.id}`;

      if (!keyMap.has(key)) {
        const group = {
          wordId: word.id,
          word: word.word,
          pos: posKey,
          meaningZhTW: chinese,
          sourceSenseIds: [senseId],
          englishDefinitions: [def.englishDefinition || def.definition]
        };
        keyMap.set(key, group);
      } else {
        const group = keyMap.get(key);
        group.sourceSenseIds.push(senseId);
        group.englishDefinitions.push(def.englishDefinition || def.definition);
      }
    });

    keyMap.forEach(g => {
      allGroups.push(g);
      if (g.sourceSenseIds.length > 1) {
        mergedGroups.push(g);
      }
    });
  });

  return { allGroups, mergedGroups };
}

const resA = getGroupsForOverrides(setupA_overrides);
const resB = getGroupsForOverrides(setupB_overrides);

console.log('--- Setup A (Manual 178 Keys / Baseline) ---');
console.log('Total Learner Meanings (Groups):', resA.allGroups.length);
console.log('Merged Duplicate Groups (sourceSenseIds > 1):', resA.mergedGroups.length);

console.log('\n--- Setup B (Auto-Differentiated 415 Keys) ---');
console.log('Total Learner Meanings (Groups):', resB.allGroups.length);
console.log('Merged Duplicate Groups (sourceSenseIds > 1):', resB.mergedGroups.length);

// Compare merged groups in A that were split in B
const mergedKeysB = new Set(resB.mergedGroups.map(g => `${g.wordId}:${g.pos}:${g.sourceSenseIds.sort().join(',')}`));

const splitGroups = resA.mergedGroups.filter(g => {
  const key = `${g.wordId}:${g.pos}:${g.sourceSenseIds.sort().join(',')}`;
  return !mergedKeysB.has(key);
});

console.log(`\nFound ${splitGroups.length} merged duplicate groups in Setup A that were split in Setup B:`);
splitGroups.forEach((g, idx) => {
  console.log(`${idx + 1}. Word: ${g.word} (${g.pos}) | Meaning: "${g.meaningZhTW}" | Sense IDs: ${g.sourceSenseIds.join(', ')}`);
});
