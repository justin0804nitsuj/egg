const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

async function main() {
  const wordsPath = pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'wordDefinitions.js')).href;
  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  const armWord = WORDS.find(w => w.word.toLowerCase() === 'arm');
  console.log('Arm word object:', armWord);
  if (armWord) {
    const entry = getWordDefinitions(armWord.id);
    console.log('Arm definitions:', entry.rawPrimaryDefinitions.map(d => ({ id: d.id, zh: d.chineseDefinition, status: d.translationStatus })));
  }
}

main().catch(console.error);
