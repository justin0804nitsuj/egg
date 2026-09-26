const fs = require('fs');
const content = fs.readFileSync('scripts/buildOverridesAndVerify.cjs', 'utf8');
const start = content.indexOf('1: {');
const end = content.indexOf('2: {');
const slice = content.slice(start, end);
const keys = [];
const regex = /"([^"]+%\d+:[^"]+)":/g;
let m;
while ((m = regex.exec(slice)) !== null) {
  keys.push(m[1]);
}
console.log('Keys count in LEVEL_MANUAL_OVERRIDES[1]:', keys.length);
