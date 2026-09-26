const fs = require('fs');

const l1Overrides = require('../src/data/wordDefinitionsZhTW_L1_overrides.js').ZH_TW_L1_OVERRIDES;

const entries = Object.entries(l1Overrides);
console.log('Total entries in current L1 overrides file:', entries.length);

// Let's filter out entries where reason starts with 'Auto-differentiated to eliminate questionable over-merge'
const originalVerified = entries.filter(([id, val]) => {
  return !val.reason.includes('Auto-differentiated');
});

console.log('Original verified manual overrides count:', originalVerified.length);
