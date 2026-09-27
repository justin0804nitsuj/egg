const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'data', 'wordDefinitions.js');
let text = fs.readFileSync(targetFile, 'utf8');

const targetContent = `  const overridesMap = OVERRIDES_BY_LEVEL[wordLevel];
  const generatedMap = GENERATED_BY_LEVEL[wordLevel];

  const override = overridesMap?.[id];
  const generated = generatedMap?.[id];

  const meaningZh = override?.meaningZhTW ?? generated?.meaningZhTW ?? chineseDefinition;
  const status = override ? 'verified' : (generated ? 'verified' : translationStatus);`;

const replacementContent = `  const overridesMap = OVERRIDES_BY_LEVEL[wordLevel];
  const generatedMap = GENERATED_BY_LEVEL[wordLevel];

  const overrideEntry = overridesMap?.[id];
  const isVerifiedOverride = typeof overrideEntry === 'string' || overrideEntry?.status === 'verified';
  const verifiedMeaning = isVerifiedOverride ? (typeof overrideEntry === 'string' ? overrideEntry : overrideEntry.meaningZhTW) : null;

  const generated = generatedMap?.[id];

  const meaningZh = verifiedMeaning ?? generated?.meaningZhTW ?? chineseDefinition;
  const status = verifiedMeaning ? 'verified' : (generated ? 'verified' : translationStatus);`;

if (text.includes(targetContent)) {
  text = text.replace(targetContent, replacementContent);
  fs.writeFileSync(targetFile, text, 'utf8');
  console.log('Successfully patched src/data/wordDefinitions.js!');
} else {
  console.error('Target content not found in src/data/wordDefinitions.js!');
}
