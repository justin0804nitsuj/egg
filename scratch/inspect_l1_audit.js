const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const l1AuditPath = path.join(PROJECT_ROOT, 'reports', 'zhTW-level1-dedup-audit.json');
const auditData = JSON.parse(fs.readFileSync(l1AuditPath, 'utf8'));

const clearGroups = (auditData.allQuestionableGroups || []).filter(g => g.classification === 'CLEAR_OVER_MERGE');

console.log(`Total CLEAR_OVER_MERGE groups in Level 1 audit: ${clearGroups.length}`);

console.log('\n--- First 5 CLEAR_OVER_MERGE groups ---');
clearGroups.slice(0, 5).forEach((g, idx) => {
  console.log(`Group ${idx + 1}: Word=${g.word} (${g.wordId}), POS=${g.partOfSpeech}, Meaning="${g.currentMeaningZhTW}"`);
  g.sourceSenseIds.forEach((sid, sIdx) => {
    console.log(`  Sense ${sIdx + 1}: ${sid} -> "${g.englishDefinitions[sIdx]}"`);
  });
});
