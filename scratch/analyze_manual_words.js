const fs = require('fs');

const l1Overrides = require('../src/data/wordDefinitionsZhTW_L1_overrides.js').ZH_TW_L1_OVERRIDES;

const manualKeys = Object.keys(l1Overrides).filter(k => !l1Overrides[k].reason.includes('Auto-differentiated'));

console.log('Manual keys count:', manualKeys.length);

// Let's check unique words for manual keys
const wordsSet = new Set();
manualKeys.forEach(k => {
  const word = k.split('%')[0];
  wordsSet.add(word);
});

console.log('Unique words affected by manual keys:', wordsSet.size);
