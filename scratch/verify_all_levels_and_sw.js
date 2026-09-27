const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const projectRoot = path.join(__dirname, '..');

async function main() {
  const { WORDS } = require('../src/data/words.js');
  const wordDefsPath = path.join(projectRoot, 'src', 'data', 'wordDefinitions.js');
  const { getWordDefinitions } = await import(pathToFileURL(wordDefsPath).href);

  const baseline = {
    1: { name: 'Level 1', targetLearnerMeanings: 1626, verifiedOverrides: 358 },
    2: { name: 'Level 2', targetLearnerMeanings: 1392, verifiedOverrides: 31 },
    3: { name: 'Level 3', targetLearnerMeanings: 1313, verifiedOverrides: 0 },
    4: { name: 'Level 4', targetLearnerMeanings: 1260, verifiedOverrides: 0 },
  };

  console.log('====================================================');
  console.log('       LEVELS 1-4 BASELINE INTEGRITY AUDIT          ');
  console.log('====================================================');

  const results = {};

  for (let lvl = 1; lvl <= 4; lvl++) {
    const levelWords = WORDS.filter(w => w.level === lvl);

    // Count runtime learner meanings
    let totalLearnerMeanings = 0;
    levelWords.forEach(w => {
      const entry = getWordDefinitions(w.id);
      if (entry && entry.primaryDefinitions) {
        totalLearnerMeanings += entry.primaryDefinitions.length;
      }
    });

    // Count verified overrides in overrides JS
    const overridesPath = path.join(projectRoot, 'src', 'data', `wordDefinitionsZhTW_L${lvl}_overrides.js`);
    const content = fs.readFileSync(overridesPath, 'utf8');
    const jsObjCode = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const overridesMap = eval('(' + jsObjCode + ')');
    const verifiedCount = Object.values(overridesMap).filter(o => o.status === 'verified').length;

    results[lvl] = {
      level: lvl,
      wordCount: levelWords.length,
      learnerMeanings: totalLearnerMeanings,
      verifiedOverrides: verifiedCount,
      targetLearnerMeanings: baseline[lvl].targetLearnerMeanings,
      targetOverrides: baseline[lvl].verifiedOverrides,
      matches: totalLearnerMeanings === baseline[lvl].targetLearnerMeanings && verifiedCount === baseline[lvl].verifiedOverrides
    };

    console.log(`Level ${lvl}:`);
    console.log(`  Words: ${levelWords.length}`);
    console.log(`  Learner Meanings: ${totalLearnerMeanings} (Expected: ${baseline[lvl].targetLearnerMeanings}) -> ${totalLearnerMeanings === baseline[lvl].targetLearnerMeanings ? 'MATCH ✔' : 'MISMATCH ✖'}`);
    console.log(`  Verified Overrides: ${verifiedCount} (Expected: ${baseline[lvl].verifiedOverrides}) -> ${verifiedCount === baseline[lvl].verifiedOverrides ? 'MATCH ✔' : 'MISMATCH ✖'}`);
  }

  // Check audit report stats for Level 1
  const l1AuditPath = path.join(projectRoot, 'reports', 'zhTW-level1-dedup-audit.json');
  const l1Audit = JSON.parse(fs.readFileSync(l1AuditPath, 'utf8'));

  console.log('\nLevel 1 Audit Group Stats:');
  console.log(`  Total Merged Groups: ${l1Audit.totalMergedGroups}`);
  console.log(`  SAFE_DUPLICATE: ${l1Audit.safeDuplicateCount}`);
  console.log(`  POSSIBLE_OVER_MERGE: ${l1Audit.possibleOverMergeCount}`);
  console.log(`  CLEAR_OVER_MERGE: ${l1Audit.clearOverMergeCount}`);

  fs.writeFileSync(path.join(projectRoot, 'reports', 'l1_import_stats.json'), JSON.stringify({
    levelResults: results,
    level1Audit: {
      totalMergedGroups: l1Audit.totalMergedGroups,
      safeDuplicateCount: l1Audit.safeDuplicateCount,
      possibleOverMergeCount: l1Audit.possibleOverMergeCount,
      clearOverMergeCount: l1Audit.clearOverMergeCount
    }
  }, null, 2));

  console.log('\nWrote reports/l1_import_stats.json');
}

main().catch(console.error);
