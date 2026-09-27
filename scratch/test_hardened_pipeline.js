const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;
  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  // LEVEL_MANUAL_OVERRIDES from buildOverridesAndVerify.cjs
  const buildScript = fs.readFileSync(path.join(PROJECT_ROOT, 'scripts', 'buildOverridesAndVerify.cjs'), 'utf8');
  const start = buildScript.indexOf('const LEVEL_MANUAL_OVERRIDES = {');
  const end = buildScript.indexOf('function autoDifferentiateSense');
  const manualOverridesCode = buildScript.slice(start, end);
  
  // Evaluate LEVEL_MANUAL_OVERRIDES
  const evalFunc = new Function(`${manualOverridesCode}; return LEVEL_MANUAL_OVERRIDES;`);
  const LEVEL_MANUAL_OVERRIDES = evalFunc();

  console.log('--- LEVEL_MANUAL_OVERRIDES counts ---');
  console.log('L1 manual keys:', Object.keys(LEVEL_MANUAL_OVERRIDES[1] || {}).length);
  console.log('L2 manual keys:', Object.keys(LEVEL_MANUAL_OVERRIDES[2] || {}).length);
  console.log('L3 manual keys:', Object.keys(LEVEL_MANUAL_OVERRIDES[3] || {}).length);
  console.log('L4 manual keys:', Object.keys(LEVEL_MANUAL_OVERRIDES[4] || {}).length);

  // Check affected sense instances for each level
  [1, 2, 3, 4].forEach(level => {
    const manualMap = LEVEL_MANUAL_OVERRIDES[level] || {};
    const levelWords = WORDS.filter(w => w.level === level);

    let matchedWordCount = 0;
    let totalPrimarySenses = 0;
    let affectedSenses = 0;

    levelWords.forEach(w => {
      const entry = getWordDefinitions(w.id);
      if (entry) {
        matchedWordCount++;
        const defs = entry.rawPrimaryDefinitions || entry.primaryDefinitions || [];
        totalPrimarySenses += defs.length;
        defs.forEach(d => {
          if (manualMap[d.id]) affectedSenses++;
        });
      }
    });

    console.log(`Level ${level}: Words=${levelWords.length}, Matched=${matchedWordCount}, RawPrimarySenses=${totalPrimarySenses}, VerifiedOverrideKeys=${Object.keys(manualMap).length}, AffectedSourceSenseInstances=${affectedSenses}`);
  });
}

main().catch(console.error);
