const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;
  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  [1, 2, 3, 4].forEach(level => {
    const levelWords = WORDS.filter(w => w.level === level);
    let senseCount = 0;
    levelWords.forEach(w => {
      const entry = getWordDefinitions(w.id);
      if (entry) {
        const defs = entry.rawPrimaryDefinitions || entry.primaryDefinitions || [];
        senseCount += defs.length;
      }
    });

    const overridesPath = path.join(PROJECT_ROOT, 'src', 'data', `wordDefinitionsZhTW_L${level}_overrides.js`);
    let overridesCount = 0;
    let manualCount = 0;
    let autoCount = 0;

    if (fs.existsSync(overridesPath)) {
      const text = fs.readFileSync(overridesPath, 'utf8');
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const obj = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
        overridesCount = Object.keys(obj).length;
        Object.values(obj).forEach(v => {
          if (v.reason && v.reason.includes('Auto-differentiated')) autoCount++;
          else manualCount++;
        });
      }
    }

    console.log(`Level ${level}: Words=${levelWords.length}, RawSenses=${senseCount}, TotalOverrides=${overridesCount} (Manual=${manualCount}, Auto=${autoCount})`);
  });
}

main().catch(console.error);
