const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const inputPath = path.join(
  __dirname,
  '..',
  '7000vocs_四欄整理.csv'
);
const outputPath = path.join(
  __dirname,
  '..',
  'src',
  'data',
  'words.js'
);

console.log('Reading CSV...');

let csv = fs.readFileSync(inputPath, 'utf8');

// 移除 UTF-8 BOM
csv = csv.replace(/^\uFEFF/, '');

const rows = parse(csv, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

function getValue(row, names) {
  for (const name of names) {
    if (row[name] !== undefined && row[name] !== '') {
      return row[name];
    }
  }

  return '';
}

const words = rows
  .map((row, index) => {
    const word = getValue(row, [
      '英文',
      'word',
      'Word',
      'English',
    ]);

    const partOfSpeech = getValue(row, [
      '詞性',
      '词性',
      'partOfSpeech',
      'pos',
    ]);

    const meaning = getValue(row, [
      '中文',
      'meaning',
      'Meaning',
      'Chinese',
    ]);

    const rawLevel = getValue(row, [
      '級別',
      '级别',
      'level',
      'Level',
    ]);

    const levelMatch = String(rawLevel).match(/\d+/);

    return {
      id: `${word.toLowerCase()}-${index + 1}`,
      word: word.trim(),
      partOfSpeech: partOfSpeech.trim(),
      meaning: meaning.trim(),
      level: levelMatch ? Number(levelMatch[0]) : 1,
    };
  })
  .filter((item) => item.word);

const output = `export const WORDS = ${JSON.stringify(
  words,
  null,
  2
)};\n`;

fs.writeFileSync(outputPath, output, 'utf8');

console.log('');
console.log('=================================');
console.log(`Converted ${words.length} words.`);
console.log(`Output: src/data/words.js`);
console.log('=================================');