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
  const l1OverridesObj = (await import(pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L1_overrides.js')).href)).ZH_TW_L1_OVERRIDES;

  // Manual keys (178)
  const l1ManualMap = {};
  Object.entries(l1OverridesObj).forEach(([k, v]) => {
    if (typeof v === 'object' && v.reason && !v.reason.includes('Auto-differentiated')) {
      l1ManualMap[k] = v;
    }
  });

  // Count how many senses in L1 words are overridden when:
  // a) using l1ManualMap
  // b) using l1OverridesObj (415)
  let manualOverriddenSenses = 0;
  let allOverriddenSenses = 0;

  l1Words.forEach(w => {
    const entry = getWordDefinitions(w.id);
    if (!entry) return;
    const defs = entry.rawPrimaryDefinitions || entry.primaryDefinitions || [];
    defs.forEach(def => {
      if (l1ManualMap[def.id]) manualOverriddenSenses++;
      if (l1OverridesObj[def.id]) allOverriddenSenses++;
    });
  });

  console.log(`L1 total primary senses: 3464`);
  console.log(`Senses matching manual overrides (178 keys): ${manualOverriddenSenses}`);
  console.log(`Senses matching all overrides (415 keys): ${allOverriddenSenses}`);

  // Check how many words in L1 have manual overrides
  const wordsWithManualOverrides = new Set();
  l1Words.forEach(w => {
    const entry = getWordDefinitions(w.id);
    if (!entry) return;
    const defs = entry.rawPrimaryDefinitions || entry.primaryDefinitions || [];
    defs.forEach(def => {
      if (l1ManualMap[def.id]) wordsWithManualOverrides.add(w.word);
    });
  });
  console.log(`Words with manual overrides in L1: ${wordsWithManualOverrides.size}`);

  // Let's check how many total senses belong to words that have manual overrides
  let totalSensesInWordsWithManualOverrides = 0;
  l1Words.forEach(w => {
    if (wordsWithManualOverrides.has(w.word)) {
      const entry = getWordDefinitions(w.id);
      const defs = entry.rawPrimaryDefinitions || entry.primaryDefinitions || [];
      totalSensesInWordsWithManualOverrides += defs.length;
    }
  });
  console.log(`Total senses in words that have manual overrides: ${totalSensesInWordsWithManualOverrides}`);
}

main().catch(console.error);
