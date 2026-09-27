const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;

  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  // Check L1 overrides file
  const l1Overrides = (await import(pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L1_overrides.js')).href)).ZH_TW_L1_OVERRIDES;
  const l2Overrides = (await import(pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L2_overrides.js')).href)).ZH_TW_L2_OVERRIDES;
  const l3Overrides = (await import(pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L3_overrides.js')).href)).ZH_TW_L3_OVERRIDES;
  const l4Overrides = (await import(pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L4_overrides.js')).href)).ZH_TW_L4_OVERRIDES;

  console.log('--- Current Overrides File Counts ---');
  console.log('L1 overrides count:', Object.keys(l1Overrides).length);
  console.log('L2 overrides count:', Object.keys(l2Overrides).length);
  console.log('L3 overrides count:', Object.keys(l3Overrides).length);
  console.log('L4 overrides count:', Object.keys(l4Overrides).length);

  // Let's check L1 overrides breakdown by reason or status
  const l1Reasons = {};
  Object.entries(l1Overrides).forEach(([k, v]) => {
    const r = typeof v === 'object' ? v.reason || 'no-reason' : 'string';
    const isAuto = r.includes('Auto-differentiated');
    const cat = isAuto ? 'auto-differentiated' : 'manual/explicit';
    l1Reasons[cat] = (l1Reasons[cat] || 0) + 1;
  });
  console.log('L1 Overrides Breakdown:', l1Reasons);

  // Check how many overrides in L1 have status or reason auto-differentiated
  const l1AutoKeys = Object.entries(l1Overrides).filter(([k, v]) => typeof v === 'object' && v.reason && v.reason.includes('Auto-differentiated')).map(([k]) => k);
  const l1ManualKeys = Object.entries(l1Overrides).filter(([k, v]) => typeof v === 'object' && (!v.reason || !v.reason.includes('Auto-differentiated'))).map(([k]) => k);

  console.log(`L1 manual keys count: ${l1ManualKeys.length}, L1 auto keys count: ${l1AutoKeys.length}`);

}

main().catch(console.error);
