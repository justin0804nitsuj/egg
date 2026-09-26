const fs = require('fs');
const path = require('path');

const l1OverridesPath = path.join(__dirname, '../src/data/wordDefinitionsZhTW_L1_overrides.js');
const l1Overrides = require(l1OverridesPath).ZH_TW_L1_OVERRIDES;

// Filter to keep only manual overrides (not starting with Auto-differentiated)
const restored = {};
Object.entries(l1Overrides).forEach(([k, v]) => {
  if (!v.reason.includes('Auto-differentiated')) {
    restored[k] = v;
  }
});

console.log('Restored manual overrides count:', Object.keys(restored).length);

// Write restored object to file
const content = `// Manual verified Traditional Chinese (Taiwan) sense overrides for Level 1 Words.
// Differentiates over-merged WordNet senses to ensure accurate learner definitions.

export const ZH_TW_L1_OVERRIDES = ${JSON.stringify(restored, null, 2)};
`;

fs.writeFileSync(l1OverridesPath, content, 'utf8');
console.log('Updated src/data/wordDefinitionsZhTW_L1_overrides.js');
