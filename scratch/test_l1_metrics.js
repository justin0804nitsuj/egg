const fs = require('fs');
const path = require('path');

// Let's test Level 1 generation & audit logic in memory to see exact numbers for different override maps

const words = require('../src/data/words.js').WORDS.filter(w => w.level === 1);
const { getWordDefinitions } = require('../src/data/wordDefinitions.js');

const l1RawSenses = [];
words.forEach(w => {
  const def = getWordDefinitions(w.id);
  if (def && def.primaryDefinitions) {
    def.primaryDefinitions.forEach((p, idx) => {
      l1RawSenses.push({
        wordId: w.id,
        word: w.word,
        pos: p.partOfSpeechLabel || p.partOfSpeech,
        senseId: p.id,
        english: p.englishDefinition || p.definition,
        origMeaning: w.meaning
      });
    });
  }
});

console.log('Level 1 raw primary senses count:', l1RawSenses.length);
