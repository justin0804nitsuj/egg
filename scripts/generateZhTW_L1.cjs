const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');
const OUTPUT_JS_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L1.js');
const REPORT_PATH = path.join(PROJECT_ROOT, 'reports', 'zhTW-level1-report.json');

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;

  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  const l1Words = WORDS.filter((w) => w.level === 1);
  console.log(`Processing ${l1Words.length} Level 1 words...`);

  // Load or generate translation mappings
  const translations = {};
  const suspiciousList = [];
  const wordsWithMultipleSenses = new Set();
  let totalPrimarySenses = 0;
  let totalTranslatedSenses = 0;

  l1Words.forEach((word) => {
    const entry = getWordDefinitions(word.id);
    if (!entry || !entry.primaryDefinitions || entry.primaryDefinitions.length === 0) {
      return;
    }

    const primaryDefs = entry.primaryDefinitions;
    totalPrimarySenses += primaryDefs.length;

    if (primaryDefs.length > 1) {
      wordsWithMultipleSenses.add(word.id);
    }

    primaryDefs.forEach((def, index) => {
      const senseId = def.id;
      const english = def.englishDefinition || def.definition;
      const pos = def.partOfSpeechLabel || def.partOfSpeech;
      const originalMeaning = word.meaning;

      // Generate precise Taiwan Traditional Chinese translation for this sense
      const { meaningZhTW, isSuspicious, reason } = translateSense({
        word: word.word,
        wordId: word.id,
        originalMeaning,
        pos,
        english,
        senseId,
        synsetId: def.synsetId,
        lexicalFile: def.lexicalFile,
        senseIndex: index,
        totalSenses: primaryDefs.length,
      });

      if (meaningZhTW) {
        translations[senseId] = {
          meaningZhTW,
        };
        totalTranslatedSenses += 1;
      }

      if (isSuspicious) {
        suspiciousList.push({
          wordId: word.id,
          word: word.word,
          senseId,
          synsetId: def.synsetId,
          pos,
          englishDefinition: english,
          meaningZhTW,
          reason,
        });
      }
    });
  });

  console.log(`Primary Senses: ${totalPrimarySenses}`);
  console.log(`Translated Senses: ${totalTranslatedSenses}`);
  console.log(`Words with multiple translated senses: ${wordsWithMultipleSenses.size}`);
  console.log(`Suspicious/Ambiguous translations: ${suspiciousList.length}`);

  // Write JS File
  const jsContent = `// Generated Traditional Chinese (Taiwan) Learner Sense Layer for Level 1 Words.
// Total Level 1 Primary Senses: ${totalPrimarySenses}

export const WORD_DEFINITIONS_ZH_TW_L1 = ${JSON.stringify(translations, null, 2)};
`;

  fs.writeFileSync(OUTPUT_JS_PATH, jsContent, 'utf8');
  console.log(`Wrote ${OUTPUT_JS_PATH} (${fs.statSync(OUTPUT_JS_PATH).size} bytes)`);

  // Write Report JSON
  const reportData = {
    generatedAt: new Date().toISOString(),
    scope: 'level-1-only',
    level1WordCount: l1Words.length,
    level1MatchedWordCount: l1Words.filter((w) => getWordDefinitions(w.id)).length,
    primarySenseCount: totalPrimarySenses,
    translatedSenseCount: totalTranslatedSenses,
    untranslatedSenseCount: totalPrimarySenses - totalTranslatedSenses,
    wordsWithMultipleTranslatedSensesCount: wordsWithMultipleSenses.size,
    suspiciousAmbiguousCount: suspiciousList.length,
    suspiciousAmbiguousTranslations: suspiciousList,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(reportData, null, 2), 'utf8');
  console.log(`Wrote ${REPORT_PATH} (${fs.statSync(REPORT_PATH).size} bytes)`);
}

function translateSense({ word, wordId, originalMeaning, pos, english, senseId, synsetId, lexicalFile, senseIndex, totalSenses }) {
  return getSenseTranslation({ word, wordId, originalMeaning, pos, english, senseId, synsetId, lexicalFile, senseIndex, totalSenses });
}

function getSenseTranslation({ word, wordId, originalMeaning, pos, english, senseId, synsetId, lexicalFile, senseIndex, totalSenses }) {
  const normEng = english.toLowerCase().trim();
  const wordLower = word.toLowerCase();

  let meaningZhTW = inferMeaningFromSemantics(wordLower, pos, normEng, originalMeaning, senseIndex, totalSenses);
  let isSuspicious = false;
  let reason = null;

  if (!meaningZhTW) {
    meaningZhTW = cleanOriginalMeaning(originalMeaning, pos);
    isSuspicious = true;
    reason = 'fallback_to_original_meaning_unverified_sense';
  }

  if (normEng.length > 120 || normEng.includes('specifically') || normEng.includes('especially when')) {
    isSuspicious = true;
    reason = reason || 'complex_or_narrow_gloss';
  }

  return {
    meaningZhTW,
    isSuspicious,
    reason,
  };
}

function cleanOriginalMeaning(meaning, pos) {
  if (!meaning) return '未知';
  let cleaned = meaning.split('/')[0].split(';')[0].trim();
  return cleaned;
}

function inferMeaningFromSemantics(word, pos, eng, orig, senseIndex, totalSenses) {
  if (eng.includes('quality of being able to perform')) return '能力；本領';
  if (eng.includes('possession of the qualities') && eng.includes('mental')) return '才能；才智';
  if (eng.includes('having the necessary means or skill')) return '能夠的；有能力的';
  if (eng.includes('skills and qualifications to do things well')) return '勝任的；有能力的';
  if (eng.includes('inherent physical or mental ability')) return '有能力的；有才能的';
  if (eng.includes('imprecise but fairly close to correct')) return '大約；大概';
  if (eng.includes('all around or on all sides')) return '到處；周圍';
  if (eng.includes('in the area or vicinity')) return '在附近；在近處';
  if (eng.includes('at an earlier place') && eng.includes('writing')) return '(文章中) 在前文；在上述';
  if (eng.includes('in or to a place that is higher')) return '在上方；向高處';
  if (eng.includes('appearing earlier in the same text')) return '上述的；前述的';
  if (eng.includes('to or in a foreign country')) return '在國外；到國外';
  if (eng.includes('far away from home')) return '在異鄉；離家';
  if (eng.includes('across an ocean')) return '在海外；在國外';

  return null;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
