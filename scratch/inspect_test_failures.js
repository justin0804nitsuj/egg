const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

async function main() {
  const wordsPath = pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'wordDefinitions.js')).href;
  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  const planeWord = WORDS.find(w => w.word.toLowerCase() === 'plane');
  console.log('Plane word object:', planeWord);
  if (planeWord) {
    const entry = getWordDefinitions(planeWord.id);
    console.log('Plane definitions:', entry.rawPrimaryDefinitions.map(d => ({ id: d.id, zh: d.chineseDefinition, status: d.translationStatus })));
  }

  const reviewQueueFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'utils', 'reviewQueue.js'), 'utf8');
  console.log('reviewQueue snippet:', reviewQueueFile.slice(0, 300));
}

main().catch(console.error);
