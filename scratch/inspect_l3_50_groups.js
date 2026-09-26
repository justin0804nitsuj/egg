const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

async function main() {
  const wordsPath = pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'wordDefinitions.js')).href;
  const l3OverridesPath = pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'wordDefinitionsZhTW_L3_overrides.js')).href;
  const l3DefsPath = pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'wordDefinitionsZhTW_L3.js')).href;

  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);
  const { ZH_TW_L3_OVERRIDES } = await import(l3OverridesPath);
  const { WORD_DEFINITIONS_ZH_TW_L3 } = await import(l3DefsPath);

  const level3Words = WORDS.filter((w) => w.level === 3);
  const level3WordIds = new Set(level3Words.map(w => w.id));

  console.log(`Total Level 3 words: ${level3Words.length}`);

  // Collect all level 3 word definition groups
  const allGroups = [];
  const mergedGroups = [];
  const overrideGroups = [];
  const distinctGroups = [];

  level3Words.forEach((word) => {
    const entry = getWordDefinitions(word.id);
    if (!entry) return;
    const primaryDefs = entry.rawPrimaryDefinitions || entry.primaryDefinitions;
    if (!primaryDefs || primaryDefs.length === 0) return;

    // Group senses by (POS + Chinese definition)
    const keyMap = new Map();

    primaryDefs.forEach((def) => {
      const senseId = def.id;
      const pos = def.partOfSpeechLabel || def.partOfSpeech || 'other';
      const eng = def.englishDefinition || def.definition;
      const zhObj = WORD_DEFINITIONS_ZH_TW_L3[senseId];
      const meaningZhTW = zhObj ? zhObj.meaningZhTW : word.meaning;

      const override = ZH_TW_L3_OVERRIDES[senseId];

      const key = `${pos}:${meaningZhTW}`;

      if (!keyMap.has(key)) {
        keyMap.set(key, {
          wordId: word.id,
          word: word.word,
          pos,
          meaningZhTW,
          senses: [{ senseId, eng, override }],
        });
      } else {
        keyMap.get(key).senses.push({ senseId, eng, override });
      }
    });

    keyMap.forEach((group) => {
      allGroups.push(group);
      const isMerged = group.senses.length > 1;
      const isOverride = group.senses.some(s => s.override);

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

  console.log(`Merged groups available: ${mergedGroups.length}`);
  console.log(`Override groups available: ${overrideGroups.length}`);
  console.log(`Distinct groups available: ${distinctGroups.length}`);

  const sampledMerged = mergedGroups.slice(0, 20);
  const sampledOverride = overrideGroups.slice(0, 15);
  const sampledDistinct = distinctGroups.slice(0, 15);

  const report = {
    sampledMerged,
    sampledOverride,
    sampledDistinct,
  };

  fs.writeFileSync('scratch/l3_sampled_50_groups.json', JSON.stringify(report, null, 2), 'utf8');
  console.log('Saved scratch/l3_sampled_50_groups.json');
}

main().catch(console.error);
