const { execSync } = require('child_process');
const fs = require('fs');

function getGitFile(commit, path) {
  try {
    return execSync(`git show ${commit}:${path}`, { maxBuffer: 50 * 1024 * 1024 }).toString();
  } catch (e) {
    return null;
  }
}

// Extract export object from JS content string
function parseOverridesJs(contentStr) {
  if (!contentStr) return {};
  const jsonStart = contentStr.indexOf('{');
  const jsonEnd = contentStr.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) return {};
  try {
    return JSON.parse(contentStr.slice(jsonStart, jsonEnd + 1));
  } catch (e) {
    return {};
  }
}

// 1. L1 Overrides comparison between 82c55e2, 81712e4, and disk (or manual)
const l1_c82_str = getGitFile('82c55e2', 'src/data/wordDefinitionsZhTW_L1_overrides.js');
const l1_c81_str = getGitFile('81712e4', 'src/data/wordDefinitionsZhTW_L1_overrides.js');

const l1_c82_overrides = parseOverridesJs(l1_c82_str);
const l1_c81_overrides = parseOverridesJs(l1_c81_str);

console.log('L1 Overrides 82c55e2 key count:', Object.keys(l1_c82_overrides).length);
console.log('L1 Overrides 81712e4 key count:', Object.keys(l1_c81_overrides).length);

// Compare keys in 81712e4 vs 82c55e2
const keys82 = new Set(Object.keys(l1_c82_overrides));
const keys81 = new Set(Object.keys(l1_c81_overrides));

const addedIn81 = [...keys81].filter(k => !keys82.has(k));
const removedIn81 = [...keys82].filter(k => !keys81.has(k));
const modifiedIn81 = [...keys81].filter(k => keys82.has(k) && JSON.stringify(l1_c81_overrides[k]) !== JSON.stringify(l1_c82_overrides[k]));

console.log(`\nBetween 82c55e2 and 81712e4 for L1 overrides:`);
console.log(`Added keys count: ${addedIn81.length}`);
console.log(`Removed keys count: ${removedIn81.length}`);
console.log(`Modified keys count: ${modifiedIn81.length}`);

// Let's check how many keys in 81712e4 are manual vs auto-differentiated
let c81_manualCount = 0;
let c81_autoCount = 0;
Object.entries(l1_c81_overrides).forEach(([k, v]) => {
  if (v.reason && v.reason.includes('Auto-differentiated')) c81_autoCount++;
  else c81_manualCount++;
});

console.log(`In 81712e4 L1 overrides: ${c81_manualCount} manual, ${c81_autoCount} auto-differentiated`);
