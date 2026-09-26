const { classifyMergedGroup } = require('../scripts/auditZhTW_dedup.cjs');

// Test 1: Incompatible domains (Finance vs Geography: bank financial vs river bank forced to "銀行")
const fakeBadGroup1 = {
  word: 'bank',
  partOfSpeech: 'noun',
  meaningZhTW: '銀行',
  englishDefinitions: [
    'a financial institution that accepts deposits and channels the money into lending activities',
    'sloping land (especially the slope adjoining a body of water like a river)'
  ]
};

const res1 = classifyMergedGroup(fakeBadGroup1);
console.log('Test 1 (bank - Finance vs Geography):');
console.log('  Classification:', res1.classification);
console.log('  Explanation:', res1.explanation);

// Test 2: Incompatible domains (Military vs Entertainment: battle military vs battle drama forced to "戰鬥")
const fakeBadGroup2 = {
  word: 'battle',
  partOfSpeech: 'noun',
  meaningZhTW: '戰鬥',
  englishDefinitions: [
    'a military engagement between opposing forces',
    'a theatrical drama or musical performance depicting a historical conflict'
  ]
};

const res2 = classifyMergedGroup(fakeBadGroup2);
console.log('\nTest 2 (battle - Military vs Entertainment):');
console.log('  Classification:', res2.classification);
console.log('  Explanation:', res2.explanation);

// Test 3: Distinct core concepts (POSSIBLE_OVER_MERGE)
const fakeBadGroup3 = {
  word: 'run',
  partOfSpeech: 'verb',
  meaningZhTW: '跑',
  englishDefinitions: [
    'move fast by using one\'s legs',
    'manage or be in charge of a business'
  ]
};

const res3 = classifyMergedGroup(fakeBadGroup3);
console.log('\nTest 3 (run - Move vs Manage):');
console.log('  Classification:', res3.classification);
console.log('  Explanation:', res3.explanation);

if (res1.classification === 'CLEAR_OVER_MERGE' && res2.classification === 'CLEAR_OVER_MERGE' && res3.classification === 'POSSIBLE_OVER_MERGE') {
  console.log('\nPASS: Audit classifier correctly flags deliberately incorrect translations and domain conflicts!');
} else {
  console.log('\nFAIL: Classifier did not flag bad over-merges as expected.');
}
