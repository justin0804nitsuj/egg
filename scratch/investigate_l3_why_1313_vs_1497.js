const { execSync } = require('child_process');
const fs = require('fs');

const gen82 = execSync('git show 82c55e2:scripts/generateZhTW.cjs').toString();
const gen81 = execSync('git show 81712e4:scripts/generateZhTW.cjs').toString();

console.log('generateZhTW.cjs size in 82c55e2:', gen82.length);
console.log('generateZhTW.cjs size in 81712e4:', gen81.length);
console.log('Are generateZhTW.cjs files identical?', gen82 === gen81);

const dict82 = execSync('git show 82c55e2:src/data/wordDefinitionsZhTW_L3.js').toString();
const dict81 = execSync('git show 81712e4:src/data/wordDefinitionsZhTW_L3.js').toString();

console.log('wordDefinitionsZhTW_L3.js size in 82c55e2:', dict82.length);
console.log('wordDefinitionsZhTW_L3.js size in 81712e4:', dict81.length);
console.log('Are wordDefinitionsZhTW_L3.js files identical?', dict82 === dict81);

// Let's parse dictionary 82 vs dictionary 81
function parseDict(str) {
  const s = str.indexOf('{');
  const e = str.lastIndexOf('}');
  return JSON.parse(str.slice(s, e + 1));
}

const map82 = parseDict(dict82);
const map81 = parseDict(dict81);

console.log('Sense count in L3 dict 82c55e2:', Object.keys(map82).length);
console.log('Sense count in L3 dict 81712e4:', Object.keys(map81).length);

// Compare values in map82 vs map81
const diffSenses = [];
Object.keys(map81).forEach(k => {
  if (!map82[k]) diffSenses.push({ senseId: k, type: 'added', val: map81[k] });
  else if (JSON.stringify(map81[k]) !== JSON.stringify(map82[k])) {
    diffSenses.push({ senseId: k, type: 'modified', old: map82[k], new: map81[k] });
  }
});

console.log('Differing senses in L3 dictionary between 82c55e2 and 81712e4:', diffSenses.length);
diffSenses.slice(0, 10).forEach(d => console.log(d));
