const fs = require('fs');
const path = require('path');

const { WORDS } = require('../src/data/words.js');
const { getWordDefinitions } = require('../src/data/wordDefinitions.js');
const { ZH_TW_L3_OVERRIDES } = require('../src/data/wordDefinitionsZhTW_L3_overrides.js');

const l3Words = WORDS.filter(w => w.level === 3);
console.log('Total Level 3 words count:', l3Words.length);

const mergedGroups = [];
const overrideGroups = [];
const distinctGroups = [];

const overrideSenseIds = new Set(Object.keys(ZH_TW_L3_OVERRIDES));

l3Words.forEach(word => {
  const entry = getWordDefinitions(word.id);
  if (!entry || (!entry.primaryDefinitions && !entry.rawPrimaryDefinitions)) return;

  // Let's inspect deduplicated learner definitions (primary)
  const primaryDefs = entry.primaryDefinitions;

  primaryDefs.forEach(group => {
    const isMerged = group.sourceSenseIds && group.sourceSenseIds.length > 1;
    const isOverride = group.sourceSenseIds && group.sourceSenseIds.some(id => overrideSenseIds.has(id));

    if (isMerged) {
      mergedGroups.push(group);
    }
    if (isOverride) {
      overrideGroups.push(group);
    }
    if (!isMerged && !isOverride) {
      distinctGroups.push(group);
    }
  });
});

console.log(`Found ${mergedGroups.length} merged L3 groups`);
console.log(`Found ${overrideGroups.length} override-affected L3 groups`);
console.log(`Found ${distinctGroups.length} distinct L3 groups`);

// Select 20 merged, 15 override, 15 distinct
const sampledMerged = mergedGroups.slice(0, 20);
const sampledOverride = overrideGroups.slice(0, 15);
const sampledDistinct = distinctGroups.slice(0, 15);

console.log('\nSampled Merged Count:', sampledMerged.length);
console.log('Sampled Override Count:', sampledOverride.length);
console.log('Sampled Distinct Count:', sampledDistinct.length);

const sampledAll = {
  merged: sampledMerged,
  override: sampledOverride,
  distinct: sampledDistinct
};

fs.writeFileSync('scratch/l3_50_sampled.json', JSON.stringify(sampledAll, null, 2), 'utf8');
console.log('Saved scratch/l3_50_sampled.json');
