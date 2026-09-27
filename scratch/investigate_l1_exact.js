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

  console.log('Total keys in wordDefinitionsZhTW_L1_overrides.js:', Object.keys(l1OverridesObj).length);

  const manualKeys = [];
  const autoKeys = [];

  Object.entries(l1OverridesObj).forEach(([senseId, val]) => {
    const reason = typeof val === 'object' ? val.reason || '' : '';
    if (reason.includes('Auto-differentiated')) {
      autoKeys.push({ senseId, val });
    } else {
      manualKeys.push({ senseId, val });
    }
  });

  console.log(`Manual Keys: ${manualKeys.length}, Auto Keys: ${autoKeys.length}`);

  // Let's check which words and sense IDs are in autoKeys
  console.log('\n--- First 20 Auto Keys in L1 ---');
  autoKeys.slice(0, 20).forEach(k => {
    console.log(`SenseId: ${k.senseId} | Meaning: "${k.val.meaningZhTW}" | Reason: "${k.val.reason}"`);
  });

  // Let's check display groups in L1 with Manual Keys only (178) vs All Keys (415)
  // We can write a generator simulator to get exact display groups and compare them.

}

main().catch(console.error);
