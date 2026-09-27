const path = require('path');
const { pathToFileURL } = require('url');
const projectRoot = path.join(__dirname, '..');

async function main() {
  const { WORDS } = require('../src/data/words.js');
  const wordDefsPath = path.join(projectRoot, 'src', 'data', 'wordDefinitions.js');
  const { getWordDefinitions } = await import(pathToFileURL(wordDefsPath).href);

  const wordsToTest = ['bridge', 'dig', 'file', 'close', 'fan', 'light', 'look', 'love', 'mind', 'need', 'night', 'north'];

  console.log('=== VERIFYING PRODUCTION RUNTIME getWordDefinitions() ===\n');

  wordsToTest.forEach(wStr => {
    const wObj = WORDS.find(w => w.word.toLowerCase() === wStr);
    if (!wObj) {
      console.log(`Word '${wStr}' not found in WORDS.`);
      return;
    }

    const entry = getWordDefinitions(wObj.id);
    if (!entry) {
      console.log(`No entry found for word '${wStr}' (${wObj.id})`);
      return;
    }

    console.log(`Word: ${wStr} (${wObj.id})`);
    console.log(`  Primary Definitions (${entry.primaryDefinitions.length}):`);
    entry.primaryDefinitions.forEach((d, idx) => {
      console.log(`    [${idx + 1}] POS: ${d.partOfSpeechLabel} (${d.primarySenseId})`);
      console.log(`        Chinese: "${d.chineseDefinition}"`);
      console.log(`        Status: "${d.translationStatus}"`);
      console.log(`        English: "${d.englishDefinition.slice(0, 75)}..."`);
    });
    console.log('');
  });
}

main().catch(console.error);
