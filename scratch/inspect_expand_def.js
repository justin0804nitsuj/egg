const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'data', 'wordDefinitions.js');
const text = fs.readFileSync(targetFile, 'utf8');

const idx = text.indexOf('function expandDefinition');
if (idx !== -1) {
  console.log('Found expandDefinition snippet:');
  console.log(text.slice(idx, idx + 600));
} else {
  console.log('expandDefinition not found');
}
