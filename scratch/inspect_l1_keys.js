const fs = require('fs');

const content = fs.readFileSync('scripts/buildOverridesAndVerify.cjs', 'utf8');
const l1Chunk = content.slice(content.indexOf('1: {'), content.indexOf('2: {'));

const map1 = eval('({' + l1Chunk + '})[1]');
console.log('Evaluated LEVEL_MANUAL_OVERRIDES[1] size:', Object.keys(map1).length);

const keys = Object.keys(map1);
console.log('Sample keys:', keys.slice(0, 10));
