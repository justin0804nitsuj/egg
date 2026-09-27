const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;
  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  // 1. Verify getWordDefinitions() learner-meaning counts for Levels 1-4
  console.log('--- Task 1.1: Runtime getWordDefinitions() Learner-Meaning Counts ---');
  [1, 2, 3, 4].forEach(level => {
    const levelWords = WORDS.filter(w => w.level === level);
    let totalPrimaryLearnerMeanings = 0;
    let autoFoundInRuntime = 0;
    let heuristicSuffixFound = 0;

    levelWords.forEach(w => {
      const defs = getWordDefinitions(w.id);
      if (defs) {
        totalPrimaryLearnerMeanings += defs.primaryDefinitions.length;
        defs.rawDefinitions.forEach(d => {
          if (d.translationStatus === 'auto_differentiated') autoFoundInRuntime++;
          if (d.chineseDefinition && d.chineseDefinition.includes('(義項')) heuristicSuffixFound++;
        });
      }
    });

    console.log(`Level ${level}: Runtime Primary Learner Meanings = ${totalPrimaryLearnerMeanings}, AutoStatusCount = ${autoFoundInRuntime}, HeuristicSuffixCount = ${heuristicSuffixFound}`);
  });

  // 2. Investigate Level 1 Overrides Key Breakdown (178 keys)
  console.log('\n--- Task 1.3: Level 1 Override Keys Analysis (178 Keys) ---');

  // Load LEVEL_MANUAL_OVERRIDES
  const buildScript = fs.readFileSync(path.join(PROJECT_ROOT, 'scripts', 'buildOverridesAndVerify.cjs'), 'utf8');
  const start = buildScript.indexOf('const LEVEL_MANUAL_OVERRIDES = {');
  const end = buildScript.indexOf('function autoDifferentiateSense');
  const manualOverridesCode = buildScript.slice(start, end);
  const LEVEL_MANUAL_OVERRIDES = (new Function(`${manualOverridesCode}; return LEVEL_MANUAL_OVERRIDES;`))();

  const l1ManualMap = LEVEL_MANUAL_OVERRIDES[1] || {};
  const l1Words = WORDS.filter(w => w.level === 1);

  // Collect all primary & secondary sense IDs in Level 1 words
  const primarySenseSet = new Set();
  const secondarySenseSet = new Set();
  const allWordNetSenseSet = new Set();

  l1Words.forEach(w => {
    const defs = getWordDefinitions(w.id);
    if (defs) {
      defs.rawPrimaryDefinitions.forEach(d => {
        primarySenseSet.add(d.id);
        allWordNetSenseSet.add(d.id);
      });
      defs.rawSecondaryDefinitions.forEach(d => {
        secondarySenseSet.add(d.id);
        allWordNetSenseSet.add(d.id);
      });
    }
  });

  const matchedPrimaryKeys = [];
  const matchedSecondaryKeys = [];
  const unmatchedKeys = [];

  Object.entries(l1ManualMap).forEach(([senseId, ov]) => {
    if (primarySenseSet.has(senseId)) {
      matchedPrimaryKeys.push({ senseId, ov });
    } else if (secondarySenseSet.has(senseId)) {
      matchedSecondaryKeys.push({ senseId, ov });
    } else {
      unmatchedKeys.push({ senseId, ov });
    }
  });

  console.log(`Total Level 1 Manual Override Keys: ${Object.keys(l1ManualMap).length}`);
  console.log(`Matched Primary Sense Keys: ${matchedPrimaryKeys.length}`);
  console.log(`Matched Secondary Sense Keys: ${matchedSecondaryKeys.length}`);
  console.log(`Unmatched / Out-of-scope Keys: ${unmatchedKeys.length}`);

  if (matchedSecondaryKeys.length > 0) {
    console.log('\n--- Secondary-Only Override Keys ---');
    matchedSecondaryKeys.forEach(k => console.log(`  ${k.senseId}: "${k.ov.meaningZhTW}" (${k.ov.reason})`));
  }

  if (unmatchedKeys.length > 0) {
    console.log('\n--- Unmatched / Out-of-Scope Override Keys ---');
    unmatchedKeys.forEach(k => console.log(`  ${k.senseId}: "${k.ov.meaningZhTW}" (${k.ov.reason})`));
  }
}

main().catch(console.error);
