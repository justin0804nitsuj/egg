const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;
  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  const l3Words = WORDS.filter(w => w.level === 3);
  const l3OverridesObj = (await import(pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L3_overrides.js')).href)).ZH_TW_L3_OVERRIDES;

  console.log('Total keys in wordDefinitionsZhTW_L3_overrides.js:', Object.keys(l3OverridesObj).length); // 285

  // Let's check manual vs auto in L3 overrides
  const l3Manual = [];
  const l3Auto = [];

  Object.entries(l3OverridesObj).forEach(([senseId, val]) => {
    const reason = typeof val === 'object' ? val.reason || '' : '';
    if (reason.includes('Auto-differentiated')) {
      l3Auto.push({ senseId, val });
    } else {
      l3Manual.push({ senseId, val });
    }
  });

  console.log(`L3 Manual overrides: ${l3Manual.length}, L3 Auto-differentiated overrides: ${l3Auto.length}`);

  // Let's check reports for L3 in commit 82c55e2 vs 81712e4 vs baseline
  // In 82c55e2: reports/zhTW-level3-report.json had learnerMeaningsAfterDeduplication: 1313!
  // In 81712e4: reports/zhTW-level3-report.json had learnerMeaningsAfterDeduplication: 1497!

  // WHY did learnerMeaningsAfterDeduplication in zhTW-level3-report.json change from 1313 to 1497 between 82c55e2 and 81712e4?
  // Let's check what changed in wordDefinitionsZhTW_L3.js or wordDefinitionsZhTW_L3_overrides.js or scripts between 82c55e2 and 81712e4!

  const c82_overrides_str = require('child_process').execSync('git show 82c55e2:src/data/wordDefinitionsZhTW_L3_overrides.js').toString();
  const c81_overrides_str = require('child_process').execSync('git show 81712e4:src/data/wordDefinitionsZhTW_L3_overrides.js').toString();

  const parseObj = str => {
    const s = str.indexOf('{');
    const e = str.lastIndexOf('}');
    return JSON.parse(str.slice(s, e + 1));
  };

  const c82_l3_overrides = parseObj(c82_overrides_str);
  const c81_l3_overrides = parseObj(c81_overrides_str);

  console.log('c82 L3 overrides count:', Object.keys(c82_l3_overrides).length);
  console.log('c81 L3 overrides count:', Object.keys(c81_l3_overrides).length);

  // Compare diffs between c82 L3 overrides and c81 L3 overrides
  const diffs = [];
  Object.keys(c81_l3_overrides).forEach(k => {
    if (!c82_l3_overrides[k]) {
      diffs.push({ key: k, type: 'added', new: c81_l3_overrides[k] });
    } else if (JSON.stringify(c81_l3_overrides[k]) !== JSON.stringify(c82_l3_overrides[k])) {
      diffs.push({ key: k, type: 'modified', old: c82_l3_overrides[k], new: c81_l3_overrides[k] });
    }
  });
  Object.keys(c82_l3_overrides).forEach(k => {
    if (!c81_l3_overrides[k]) {
      diffs.push({ key: k, type: 'removed', old: c82_l3_overrides[k] });
    }
  });

  console.log(`Diff count in L3 overrides between 82c55e2 and 81712e4: ${diffs.length}`);
  diffs.slice(0, 10).forEach(d => console.log(d));
}

main().catch(console.error);
