const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');

// 1. Build L1 overrides using buildOverridesAndVerify.cjs --level 1
console.log('Building L1 overrides...');
execSync('node scripts/buildOverridesAndVerify.cjs --level 1', { cwd: PROJECT_ROOT, stdio: 'inherit' });

// 2. Build L1 dictionary and report using generateZhTW.cjs --level 1
console.log('Generating L1 dictionary...');
execSync('node scripts/generateZhTW.cjs --level 1', { cwd: PROJECT_ROOT, stdio: 'inherit' });

// 3. For L2, L3, L4: update overrides file status fields
[2, 3, 4].forEach(level => {
  const filePath = path.join(PROJECT_ROOT, 'src', 'data', `wordDefinitionsZhTW_L${level}_overrides.js`);
  if (!fs.existsSync(filePath)) return;
  const contentStr = fs.readFileSync(filePath, 'utf8');
  const jsonStart = contentStr.indexOf('{');
  const jsonEnd = contentStr.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) return;

  const obj = JSON.parse(contentStr.slice(jsonStart, jsonEnd + 1));
  let updatedCount = 0;
  Object.entries(obj).forEach(([k, v]) => {
    if (v.reason && v.reason.includes('Auto-differentiated')) {
      if (v.status !== 'auto_differentiated') {
        v.status = 'auto_differentiated';
        updatedCount++;
      }
    }
  });

  const exportVarName = `ZH_TW_L${level}_OVERRIDES`;
  const newContent = `// Manual verified Traditional Chinese (Taiwan) sense overrides for Level ${level} Words.
// Differentiates over-merged WordNet senses to ensure accurate learner definitions.

export const ${exportVarName} = ${JSON.stringify(obj, null, 2)};
`;

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Updated L${level} overrides: ${updatedCount} entries set to status 'auto_differentiated'.`);
});
