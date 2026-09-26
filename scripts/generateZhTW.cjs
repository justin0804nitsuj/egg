const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

function getLevelArg() {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--level');
  if (idx !== -1 && args[idx + 1]) {
    return parseInt(args[idx + 1], 10);
  }
  const shortIdx = args.indexOf('-l');
  if (shortIdx !== -1 && args[shortIdx + 1]) {
    return parseInt(args[shortIdx + 1], 10);
  }
  return 2;
}

const level = getLevelArg();
const OUTPUT_JS_PATH = path.join(PROJECT_ROOT, 'src', 'data', `wordDefinitionsZhTW_L${level}.js`);
const REPORT_PATH = path.join(PROJECT_ROOT, 'reports', `zhTW-level${level}-report.json`);

// Specific Taiwan Traditional Chinese vocabulary replacements
const TAIWAN_VOCAB_MAP = {
  '軟件': '軟體',
  '程序的': '程式的',
  '程序': '程式',
  '出租車': '計程車',
  '公共汽車': '公車',
  '視頻': '影片',
  '打印': '列印',
  '內存': '記憶體',
  '網絡': '網路',
  '信箱': '郵箱',
  '信息': '資訊',
  '硬盤': '硬碟',
  '鼠標': '滑鼠',
  '數碼': '數位',
  '屏幕': '螢幕',
  '服務器': '伺服器',
  '智能': '智慧型',
  '幼兒園': '幼稚園',
  '塑料': '塑膠',
  '黃油': '奶油',
  '吐司': '吐司',
  '便當': '便當',
  '黃瓜': '小黃瓜',
  '菠蘿': '鳳梨',
  '三文魚': '鮭魚',
  '金槍魚': '鮪魚',
  '方便面': '泡麵',
  '公交車': '公車',
  '地鐵': '捷運',
  '自行車': '腳踏車',
  '摩托車': '機車',
};

function applyTaiwanTerms(str) {
  if (!str) return str;
  let res = str;
  Object.entries(TAIWAN_VOCAB_MAP).forEach(([cn, tw]) => {
    res = res.replace(new RegExp(cn, 'g'), tw);
  });
  return res;
}

function normalizeChineseMeaning(meaning) {
  if (!meaning) return '';
  return meaning
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[，、；;。.]$/g, '')
    .trim();
}

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;

  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  const levelWords = WORDS.filter((w) => w.level === level);
  console.log(`Processing ${levelWords.length} Level ${level} words...`);

  const translations = {};
  const suspiciousList = [];
  const wordsWithMultipleSenses = new Set();
  let totalPrimarySenses = 0;
  let totalTranslatedSenses = 0;

  const rawPrimaryDefsByWord = [];

  levelWords.forEach((word) => {
    const entry = getWordDefinitions(word.id);
    if (!entry || (!entry.primaryDefinitions && !entry.rawPrimaryDefinitions)) {
      return;
    }

    const primaryDefs = entry.rawPrimaryDefinitions || entry.primaryDefinitions;
    if (!primaryDefs || primaryDefs.length === 0) return;

    totalPrimarySenses += primaryDefs.length;

    if (primaryDefs.length > 1) {
      wordsWithMultipleSenses.add(word.id);
    }

    const wordSenses = [];

    primaryDefs.forEach((def, index) => {
      const senseId = def.id;
      const english = def.englishDefinition || def.definition;
      const pos = def.partOfSpeechLabel || def.partOfSpeech;
      const originalMeaning = word.meaning;

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

      const cleanMeaning = applyTaiwanTerms(meaningZhTW);

      if (cleanMeaning) {
        translations[senseId] = {
          meaningZhTW: cleanMeaning,
        };
        totalTranslatedSenses += 1;
      }

      const senseItem = {
        ...def,
        chineseDefinition: cleanMeaning,
        meaningZh: cleanMeaning,
      };

      wordSenses.push(senseItem);

      if (isSuspicious) {
        suspiciousList.push({
          wordId: word.id,
          word: word.word,
          senseId,
          synsetId: def.synsetId,
          pos,
          englishDefinition: english,
          meaningZhTW: cleanMeaning,
          reason,
        });
      }
    });

    rawPrimaryDefsByWord.push({
      wordId: word.id,
      word: word.word,
      senses: wordSenses,
    });
  });

  // Calculate Deduplication Statistics
  let totalLearnerMeaningsBefore = totalPrimarySenses;
  let totalLearnerMeaningsAfter = 0;
  let affectedWordsCount = 0;
  const mergedExamples = [];

  rawPrimaryDefsByWord.forEach((w) => {
    const keyMap = new Map();
    const dedupedGroups = [];

    w.senses.forEach((def) => {
      const posKey = def.partOfSpeechLabel || def.partOfSpeech || 'other';
      const chinese = def.chineseDefinition || '';
      const normZh = normalizeChineseMeaning(chinese);
      const key = normZh ? `${posKey}:${normZh}` : `${posKey}:raw:${def.id}`;

      if (!keyMap.has(key)) {
        const group = {
          wordId: w.wordId,
          word: w.word,
          pos: posKey,
          meaningZhTW: chinese,
          primarySenseId: def.id,
          sourceSenseIds: [def.id],
          englishDefinitions: [def.englishDefinition || def.definition],
        };
        keyMap.set(key, group);
        dedupedGroups.push(group);
      } else {
        const existing = keyMap.get(key);
        existing.sourceSenseIds.push(def.id);
        existing.englishDefinitions.push(def.englishDefinition || def.definition);
      }
    });

    totalLearnerMeaningsAfter += dedupedGroups.length;

    if (dedupedGroups.length < w.senses.length) {
      affectedWordsCount += 1;
      const collapsed = dedupedGroups.filter((g) => g.sourceSenseIds.length > 1);
      collapsed.forEach((g) => {
        mergedExamples.push({
          wordId: g.wordId,
          word: g.word,
          pos: g.pos,
          meaningZhTW: g.meaningZhTW,
          primarySenseId: g.primarySenseId,
          sourceSenseIds: g.sourceSenseIds,
          englishDefinitions: g.englishDefinitions,
        });
      });
    }
  });

  const duplicatesRemoved = totalLearnerMeaningsBefore - totalLearnerMeaningsAfter;

  console.log(`Level ${level} Words Count: ${levelWords.length}`);
  console.log(`Translated Raw Primary Senses: ${totalTranslatedSenses}`);
  console.log(`Learner Meanings Before Deduplication: ${totalLearnerMeaningsBefore}`);
  console.log(`Learner Meanings After Deduplication: ${totalLearnerMeaningsAfter}`);
  console.log(`Duplicates Removed from Display: ${duplicatesRemoved}`);
  console.log(`Words Affected by Deduplication: ${affectedWordsCount}`);

  // Write JS File
  const exportVarName = `WORD_DEFINITIONS_ZH_TW_L${level}`;
  const jsContent = `// Generated Traditional Chinese (Taiwan) Learner Sense Layer for Level ${level} Words.
// Total Level ${level} Primary Senses: ${totalPrimarySenses}

export const ${exportVarName} = ${JSON.stringify(translations, null, 2)};
`;

  fs.writeFileSync(OUTPUT_JS_PATH, jsContent, 'utf8');
  console.log(`Wrote ${OUTPUT_JS_PATH} (${fs.statSync(OUTPUT_JS_PATH).size} bytes)`);

  // Write Report JSON
  const reportData = {
    generatedAt: new Date().toISOString(),
    scope: `level-${level}-only`,
    [`level${level}WordCount`]: levelWords.length,
    [`level${level}MatchedWordCount`]: levelWords.filter((w) => getWordDefinitions(w.id)).length,
    translatedRawSenseCount: totalTranslatedSenses,
    learnerMeaningsBeforeDeduplication: totalLearnerMeaningsBefore,
    learnerMeaningsAfterDeduplication: totalLearnerMeaningsAfter,
    duplicatesRemovedFromDisplay: duplicatesRemoved,
    wordsAffectedByDeduplication: affectedWordsCount,
    wordsWithMultipleTranslatedSensesCount: wordsWithMultipleSenses.size,
    suspiciousAmbiguousCount: suspiciousList.length,
    mergedDuplicateExamples: mergedExamples.slice(0, 30),
    suspiciousAmbiguousTranslations: suspiciousList,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(reportData, null, 2), 'utf8');
  console.log(`Wrote ${REPORT_PATH} (${fs.statSync(REPORT_PATH).size} bytes)`);
}

function translateSense(ctx) {
  return getSenseTranslation(ctx);
}

function getSenseTranslation(ctx) {
  const { word, wordId, originalMeaning, pos, english, senseId, synsetId, lexicalFile, senseIndex, totalSenses } = ctx;
  const normEng = english.toLowerCase().trim();
  const wordLower = word.toLowerCase();

  const OVERRIDES = getExplicitSenseOverrides();
  if (OVERRIDES[senseId]) {
    return {
      meaningZhTW: OVERRIDES[senseId],
      isSuspicious: false,
      reason: null,
    };
  }

  const disambiguation = disambiguateWordSense(wordLower, pos, normEng, originalMeaning, senseIndex, totalSenses, lexicalFile);
  if (disambiguation) {
    return disambiguation;
  }

  const patternMeaning = translateByPattern(wordLower, pos, normEng, originalMeaning, lexicalFile);
  if (patternMeaning) {
    return {
      meaningZhTW: patternMeaning,
      isSuspicious: false,
      reason: null,
    };
  }

  const defaultMeaning = adaptOriginalMeaningForSense(wordLower, pos, originalMeaning, normEng, senseIndex, totalSenses);
  const isSuspicious = normEng.length > 130 || normEng.includes('specifically') || normEng.includes('technically');

  return {
    meaningZhTW: defaultMeaning,
    isSuspicious,
    reason: isSuspicious ? 'complex_or_technical_definition' : null,
  };
}

function adaptOriginalMeaningForSense(word, pos, originalMeaning, english, senseIndex, totalSenses) {
  if (!originalMeaning) return '未知';

  let parts = originalMeaning.split(/[\/,;]/).map((p) => p.trim()).filter(Boolean);

  if (totalSenses === 1) {
    return parts.join('；');
  }

  if (parts.length > senseIndex) {
    return parts[senseIndex];
  }

  return parts[0];
}

function disambiguateWordSense(word, pos, eng, orig, index, total, lexicalFile) {
  if (word === 'act') {
    if (eng.includes('legal document') || eng.includes('legislative')) return { meaningZhTW: '法案；條例', isSuspicious: false };
    if (eng.includes('something that people do') || eng.includes('cause to happen')) return { meaningZhTW: '行動；行為', isSuspicious: false };
    if (eng.includes('subdivision of a play')) return { meaningZhTW: '（戲劇的）幕', isSuspicious: false };
    if (eng.includes('perform an action')) return { meaningZhTW: '行動；採取行動', isSuspicious: false };
    if (eng.includes('behave in a certain manner')) return { meaningZhTW: '表現；舉止', isSuspicious: false };
    if (eng.includes('play a role')) return { meaningZhTW: '扮演；演戲', isSuspicious: false };
  }

  if (word === 'action') {
    if (eng.includes('something done')) return { meaningZhTW: '行動；行為', isSuspicious: false };
    if (eng.includes('state of being active')) return { meaningZhTW: '活動；運作', isSuspicious: false };
    if (eng.includes('military engagement')) return { meaningZhTW: '軍事行動；戰鬥', isSuspicious: false };
  }

  if (word === 'bank') {
    if (eng.includes('financial institution') || eng.includes('accepts deposits')) return { meaningZhTW: '銀行', isSuspicious: false };
    if (eng.includes('sloping land') || eng.includes('beside a body of water')) return { meaningZhTW: '河岸；堤岸', isSuspicious: false };
    if (eng.includes('container') && eng.includes('money')) return { meaningZhTW: '存錢筒；撲滿', isSuspicious: false };
    if (eng.includes('deposit money')) return { meaningZhTW: '把（錢）存入銀行', isSuspicious: false };
    if (eng.includes('do business with')) return { meaningZhTW: '在（銀行）開戶往來', isSuspicious: false };
  }

  if (word === 'bear') {
    if (eng.includes('mammal') || eng.includes('carnivore')) return { meaningZhTW: '熊', isSuspicious: false };
    if (eng.includes('endure') || eng.includes('unpleasant')) return { meaningZhTW: '忍受；承受', isSuspicious: false };
    if (eng.includes('support') || eng.includes('hold up')) return { meaningZhTW: '支撐；承受重量', isSuspicious: false };
    if (eng.includes('have or contain') || eng.includes('feature')) return { meaningZhTW: '帶有；帶有...特徵', isSuspicious: false };
  }

  return null;
}

function translateByPattern(word, pos, eng, orig, lexicalFile) {
  if (eng.includes('quality of being able to perform')) return '能力；本領';
  if (eng.includes('possession of the qualities') && eng.includes('mental')) return '才能；才智';
  if (eng.includes('imprecise but fairly close to correct')) return '大約；大概';
  if (eng.includes('all around or on all sides')) return '到處；周圍';
  if (eng.includes('in or to a foreign country')) return '在國外；到國外';
  if (eng.includes('a person who') || eng.includes('someone who')) {
    let cleanOrig = orig.split('/')[0].split(';')[0].trim();
    if (cleanOrig.endsWith('人') || cleanOrig.endsWith('員') || cleanOrig.endsWith('家')) {
      return cleanOrig;
    }
    return cleanOrig + '（人）';
  }
  if (eng.includes('a device') || eng.includes('an instrument') || eng.includes('a tool')) {
    let cleanOrig = orig.split('/')[0].split(';')[0].trim();
    return cleanOrig;
  }

  return null;
}

function getExplicitSenseOverrides() {
  return {};
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
