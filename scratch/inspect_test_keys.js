const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

async function main() {
  const overrides = (await import(pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'wordDefinitionsZhTW_L1_overrides.js')).href)).ZH_TW_L1_OVERRIDES;
  const dict = (await import(pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'wordDefinitionsZhTW_L1.js')).href)).WORD_DEFINITIONS_ZH_TW_L1;

  console.log('--- Overrides sample keys ---');
  Object.keys(overrides).filter(k => k.startsWith('blue')).forEach(k => console.log(k, overrides[k]));

  console.log('--- Dict sample keys for blue ---');
  Object.keys(dict).filter(k => k.startsWith('blue')).forEach(k => console.log(k, dict[k]));

  // Check why allPreserved failed in test 4
  const unpreserved = [];
  Object.entries(overrides).forEach(([senseId, ov]) => {
    if (ov.status === 'verified') {
      const dictEntry = dict[senseId];
      if (!dictEntry || dictEntry.meaningZhTW !== ov.meaningZhTW) {
        unpreserved.push({ senseId, ov, dictEntry });
      }
    }
  });

  console.log(`Unpreserved verified overrides count: ${unpreserved.length}`);
  unpreserved.forEach(u => console.log(u));
}

main().catch(console.error);
