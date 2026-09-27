const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const auditData = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'reports', 'zhTW-level1-dedup-audit.json'), 'utf8'));

console.log('Summary in audit file:', auditData.summary);

const allQuestionable = auditData.allQuestionableGroups || [];
const clearGroups = allQuestionable.filter(g => g.classification === 'CLEAR_OVER_MERGE');
const possibleGroups = allQuestionable.filter(g => g.classification === 'POSSIBLE_OVER_MERGE');

console.log(`Total Questionable Groups: ${allQuestionable.length}`);
console.log(`CLEAR_OVER_MERGE groups count: ${clearGroups.length}`);
console.log(`POSSIBLE_OVER_MERGE groups count: ${possibleGroups.length}`);

// Let's check if there are 145 total CLEAR_OVER_MERGE groups across primary and secondary or audit criteria
let clearSenseCount = 0;
clearGroups.forEach(g => {
  clearSenseCount += g.sourceSenseIds.length;
});
console.log(`Total sense IDs across CLEAR_OVER_MERGE groups: ${clearSenseCount}`);
