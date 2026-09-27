const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;
  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  const blueWord = WORDS.find(w => w.word.toLowerCase() === 'blue');
  console.log('Blue word:', blueWord);
  if (blueWord) {
    const entry = getWordDefinitions(blueWord.id);
    console.log('Blue entry rawPrimaryDefinitions:');
    (entry.rawPrimaryDefinitions || entry.primaryDefinitions || []).forEach(d => console.log('  ', d.id, d.definition));
  }
}

main().catch(console.error);
