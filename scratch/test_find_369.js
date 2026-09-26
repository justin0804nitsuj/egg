const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

async function testAll() {
  const overridesModule = await import(pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'wordDefinitionsZhTW_L1_overrides.js')).href);
  const allEntries = Object.entries(overridesModule.ZH_TW_L1_OVERRIDES);

  console.log(`Total entries in L1 overrides file: ${allEntries.length}`);

  // Test N from 369 to 415
  for (let N = 369; N <= allEntries.length; N++) {
    const sliceMap = Object.fromEntries(allEntries.slice(0, N));
    // Write temporary overrides file or test inline
    // Let's see what N equals 369 gives when passed into full generate algorithm
  }

  // Also check how many entries are in LEVEL_MANUAL_OVERRIDES[1] in buildOverridesAndVerify.cjs
  const buildScript = fs.readFileSync('scripts/buildOverridesAndVerify.cjs', 'utf8');
  const start = buildScript.indexOf('1: {');
  const end = buildScript.indexOf('2: {');
  const l1ManualObj = eval('({' + buildScript.slice(start, end).trim().replace(/,\s*$/, '') + '})')[1];
  console.log('LEVEL_MANUAL_OVERRIDES[1] keys:', Object.keys(l1ManualObj).length);
}

testAll();
