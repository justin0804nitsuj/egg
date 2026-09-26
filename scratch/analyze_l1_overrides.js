const fs = require('fs');
const l1Overrides = require('../src/data/wordDefinitionsZhTW_L1_overrides.js').ZH_TW_L1_OVERRIDES;

const entries = Object.entries(l1Overrides);
console.log('Total L1 overrides in file:', entries.length);

const manual = entries.filter(([id, val]) => !val.reason.includes('Auto-differentiated'));
const auto = entries.filter(([id, val]) => val.reason.includes('Auto-differentiated'));

console.log('Manual overrides count:', manual.length);
console.log('Auto-differentiated count:', auto.length);
