const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  const l4OverridesObj = (await import(pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L4_overrides.js')).href)).ZH_TW_L4_OVERRIDES;

  console.log('Total keys in wordDefinitionsZhTW_L4_overrides.js:', Object.keys(l4OverridesObj).length); // 258

  let l4_manual = 0;
  let l4_auto = 0;

  Object.entries(l4OverridesObj).forEach(([k, v]) => {
    if (v.reason && v.reason.includes('Auto-differentiated')) l4_auto++;
    else l4_manual++;
  });

  console.log(`L4 overrides breakdown: ${l4_manual} manual, ${l4_auto} auto-differentiated`);
}

main().catch(console.error);
