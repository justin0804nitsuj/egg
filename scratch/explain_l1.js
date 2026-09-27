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
  const l1OverridesAll = (await import(pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L1_overrides.js')).href)).ZH_TW_L1_OVERRIDES;

  const l1ManualOverrides = {};
  Object.entries(l1OverridesAll).forEach(([k, v]) => {
    if (typeof v === 'object' && v.reason && !v.reason.includes('Auto-differentiated')) {
      l1ManualOverrides[k] = v;
    }
  });

  console.log('L1 All Overrides Key Count:', Object.keys(l1OverridesAll).length); // 415
  console.log('L1 Manual Overrides Key Count:', Object.keys(l1ManualOverrides).length); // 178

  // Let's count how many senses in L1 are overridden by l1ManualOverrides vs l1OverridesAll vs disambiguateWordSense logic in generateZhTW.cjs!
  // Wait, generateZhTW.cjs has disambiguateWordSense for 4 words: act, action, bank, bear!
  // How many senses do those words have?
  let disambiguatedSenseCount = 0;
  l1Words.forEach(w => {
    const entry = getWordDefinitions(w.id);
    if (!entry) return;
    const defs = entry.rawPrimaryDefinitions || entry.primaryDefinitions || [];
    if (['act', 'action', 'bank', 'bear'].includes(w.word.toLowerCase())) {
      disambiguatedSenseCount += defs.length;
    }
  });

  console.log('Disambiguated senses from code logic:', disambiguatedSenseCount);

  // Let's run deduplication simulation with manual overrides vs all overrides
  // We need to import translateSense from generateZhTW.cjs or simulate it exactly.

  // Let's check how many total primary senses L1 has:
  let totalL1Senses = 0;
  l1Words.forEach(w => {
    const entry = getWordDefinitions(w.id);
    if (!entry) return;
    const defs = entry.rawPrimaryDefinitions || entry.primaryDefinitions || [];
    totalL1Senses += defs.length;
  });

  console.log('Total L1 raw primary senses:', totalL1Senses); // 3464
}

main().catch(console.error);
