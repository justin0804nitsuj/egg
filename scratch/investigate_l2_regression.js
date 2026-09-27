const { execSync } = require('child_process');
const fs = require('fs');

const dict82_l2 = execSync('git show 82c55e2:src/data/wordDefinitionsZhTW_L2.js').toString();
const dict81_l2 = execSync('git show 81712e4:src/data/wordDefinitionsZhTW_L2.js').toString();

console.log('L2 dict size 82c55e2:', dict82_l2.length);
console.log('L2 dict size 81712e4:', dict81_l2.length);
console.log('Are L2 dict files identical?', dict82_l2 === dict81_l2);

const over82_l2 = execSync('git show 82c55e2:src/data/wordDefinitionsZhTW_L2_overrides.js').toString();
const over81_l2 = execSync('git show 81712e4:src/data/wordDefinitionsZhTW_L2_overrides.js').toString();

console.log('L2 overrides size 82c55e2:', over82_l2.length);
console.log('L2 overrides size 81712e4:', over81_l2.length);
console.log('Are L2 overrides files identical?', over82_l2 === over81_l2);

function parseObj(str) {
  const s = str.indexOf('{');
  const e = str.lastIndexOf('}');
  return JSON.parse(str.slice(s, e + 1));
}

const map82 = parseObj(dict82_l2);
const map81 = parseDict(dict81_l2);

function parseDict(str) {
  const s = str.indexOf('{');
  const e = str.lastIndexOf('}');
  return JSON.parse(str.slice(s, e + 1));
}

const ov82 = parseObj(over82_l2);
const ov81 = parseObj(over81_l2);

console.log('L2 overrides key count 82c55e2:', Object.keys(ov82).length);
console.log('L2 overrides key count 81712e4:', Object.keys(ov81).length);

// Check how many of L2 overrides in 82c55e2/81712e4 are auto-differentiated vs manual
let l2_manual = 0;
let l2_auto = 0;

Object.entries(ov81).forEach(([k, v]) => {
  if (v.reason && v.reason.includes('Auto-differentiated')) l2_auto++;
  else l2_manual++;
});

console.log(`L2 overrides breakdown in 81712e4: ${l2_manual} manual, ${l2_auto} auto-differentiated`);
