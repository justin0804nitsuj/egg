const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');
const OUTPUT_JS_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L1.js');
const REPORT_PATH = path.join(PROJECT_ROOT, 'reports', 'zhTW-level1-report.json');

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
  '數碼': '數位相機',
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
};

function applyTaiwanTerms(str) {
  if (!str) return str;
  let res = str;
  Object.entries(TAIWAN_VOCAB_MAP).forEach(([cn, tw]) => {
    res = res.replace(new RegExp(cn, 'g'), tw);
  });
  return res;
}

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;

  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  const l1Words = WORDS.filter((w) => w.level === 1);
  console.log(`Processing ${l1Words.length} Level 1 words...`);

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

function translateSense(ctx) {
  return getSenseTranslation(ctx);
}

function getSenseTranslation(ctx) {
  const { word, wordId, originalMeaning, pos, english, senseId, synsetId, lexicalFile, senseIndex, totalSenses } = ctx;
  const normEng = english.toLowerCase().trim();
  const wordLower = word.toLowerCase();

  // 1. Check explicit sense overrides
  const OVERRIDES = getExplicitSenseOverrides();
  if (OVERRIDES[senseId]) {
    return {
      meaningZhTW: OVERRIDES[senseId],
      isSuspicious: false,
      reason: null,
    };
  }

  // 2. Disambiguate common multi-sense words
  const disambiguation = disambiguateWordSense(wordLower, pos, normEng, originalMeaning, senseIndex, totalSenses, lexicalFile);
  if (disambiguation) {
    return disambiguation;
  }

  // 3. Pattern-based translation heuristics
  const patternMeaning = translateByPattern(wordLower, pos, normEng, originalMeaning, lexicalFile);
  if (patternMeaning) {
    return {
      meaningZhTW: patternMeaning,
      isSuspicious: false,
      reason: null,
    };
  }

  // 4. Default sense translation based on original meaning + POS adaptation
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

  // If word has multiple senses and multiple Chinese terms in originalMeaning, pick corresponding or combine cleanly
  if (parts.length > senseIndex) {
    return parts[senseIndex];
  }

  return parts[0];
}

function disambiguateWordSense(word, pos, eng, orig, index, total, lexicalFile) {
  // Bank
  if (word === 'bank') {
    if (eng.includes('financial institution') || eng.includes('accepts deposits')) return { meaningZhTW: '銀行', isSuspicious: false };
    if (eng.includes('sloping land') || eng.includes('beside a body of water')) return { meaningZhTW: '河岸；堤岸', isSuspicious: false };
    if (eng.includes('container') && eng.includes('money')) return { meaningZhTW: '存錢筒；撲滿', isSuspicious: false };
    if (eng.includes('deposit money')) return { meaningZhTW: '把（錢）存入銀行', isSuspicious: false };
    if (eng.includes('do business with')) return { meaningZhTW: '在（銀行）開戶往來', isSuspicious: false };
  }

  // Book
  if (word === 'book') {
    if (eng.includes('written work') || eng.includes('bound')) return { meaningZhTW: '書籍；書本', isSuspicious: false };
    if (eng.includes('record') || eng.includes('record-book')) return { meaningZhTW: '帳簿；記錄簿', isSuspicious: false };
    if (eng.includes('engage for') || eng.includes('reserve')) return { meaningZhTW: '預訂；預約', isSuspicious: false };
  }

  // Bear
  if (word === 'bear') {
    if (eng.includes('mammal') || eng.includes('carnivore')) return { meaningZhTW: '熊', isSuspicious: false };
    if (eng.includes('endure') || eng.includes('unpleasant')) return { meaningZhTW: '忍受；承受', isSuspicious: false };
    if (eng.includes('support') || eng.includes('hold up')) return { meaningZhTW: '支撐；承受重量', isSuspicious: false };
    if (eng.includes('have or contain') || eng.includes('feature')) return { meaningZhTW: '帶有；帶有...特徵', isSuspicious: false };
  }

  // Fly
  if (word === 'fly') {
    if (eng.includes('insect') || eng.includes('dipterous')) return { meaningZhTW: '蒼蠅', isSuspicious: false };
    if (eng.includes('aircraft') || eng.includes('operate')) return { meaningZhTW: '駕駛（飛機）；飛行', isSuspicious: false };
    if (eng.includes('air') || eng.includes('wings')) return { meaningZhTW: '飛；飛行', isSuspicious: false };
  }

  // Park
  if (word === 'park') {
    if (eng.includes('natural state') || eng.includes('recreation')) return { meaningZhTW: '公園；國家公園', isSuspicious: false };
    if (eng.includes('vehicle') || eng.includes('leave')) return { meaningZhTW: '停放（車輛）；停車', isSuspicious: false };
  }

  // Light
  if (word === 'light') {
    if (eng.includes('radiation') || eng.includes('eye')) return { meaningZhTW: '光；光線', isSuspicious: false };
    if (eng.includes('device') || eng.includes('illumination')) return { meaningZhTW: '燈；照明設備', isSuspicious: false };
    if (eng.includes('weight') || eng.includes('heavy')) return { meaningZhTW: '輕的；重量輕的', isSuspicious: false };
    if (eng.includes('make lighter') || eng.includes('ignite')) return { meaningZhTW: '點燃；照亮', isSuspicious: false };
  }

  // Run
  if (word === 'run') {
    if (eng.includes('feet') || eng.includes('fast')) return { meaningZhTW: '跑步；奔跑', isSuspicious: false };
    if (eng.includes('management') || eng.includes('conduct')) return { meaningZhTW: '經營；管理', isSuspicious: false };
    if (eng.includes('operate') || eng.includes('machine')) return { meaningZhTW: '運轉；運行', isSuspicious: false };
    if (eng.includes('candidate') || eng.includes('office')) return { meaningZhTW: '競選', isSuspicious: false };
  }

  // Spring
  if (word === 'spring') {
    if (eng.includes('season') || eng.includes('growth')) return { meaningZhTW: '春天；春季', isSuspicious: false };
    if (eng.includes('ground water') || eng.includes('water')) return { meaningZhTW: '泉水；溫泉', isSuspicious: false };
    if (eng.includes('elastic') || eng.includes('coil')) return { meaningZhTW: '彈簧', isSuspicious: false };
    if (eng.includes('bound') || eng.includes('leap')) return { meaningZhTW: '跳躍；彈跳', isSuspicious: false };
  }

  // Water
  if (word === 'water') {
    if (eng.includes('liquid') || eng.includes('colorless')) return { meaningZhTW: '水', isSuspicious: false };
    if (eng.includes('physiographic') || eng.includes('ocean')) return { meaningZhTW: '水域；海域', isSuspicious: false };
    if (eng.includes('pour') || eng.includes('supply')) return { meaningZhTW: '澆水；供水', isSuspicious: false };
  }

  // Play
  if (word === 'play') {
    if (eng.includes('dramatic') || eng.includes('stage')) return { meaningZhTW: '戲劇；劇本', isSuspicious: false };
    if (eng.includes('games') || eng.includes('sports')) return { meaningZhTW: '玩耍；打（球）；參加比賽', isSuspicious: false };
    if (eng.includes('instrument') || eng.includes('music')) return { meaningZhTW: '演奏（樂器）', isSuspicious: false };
    if (eng.includes('act') || eng.includes('movie')) return { meaningZhTW: '扮演；飾演', isSuspicious: false };
  }

  // Watch
  if (word === 'watch') {
    if (eng.includes('timepiece') || eng.includes('wrist')) return { meaningZhTW: '手錶', isSuspicious: false };
    if (eng.includes('attentively') || eng.includes('look')) return { meaningZhTW: '觀看；注視', isSuspicious: false };
    if (eng.includes('guard') || eng.includes('protect')) return { meaningZhTW: '看守；監視', isSuspicious: false };
  }

  // Plant
  if (word === 'plant') {
    if (eng.includes('flora') || eng.includes('vegetable') || eng.includes('photosynthesis')) return { meaningZhTW: '植物', isSuspicious: false };
    if (eng.includes('factory') || eng.includes('buildings')) return { meaningZhTW: '工廠；發電廠', isSuspicious: false };
    if (eng.includes('put in the ground') || eng.includes('seed')) return { meaningZhTW: '種植；栽種', isSuspicious: false };
  }

  // Letter
  if (word === 'letter') {
    if (eng.includes('written message') || eng.includes('mail')) return { meaningZhTW: '信件；書信', isSuspicious: false };
    if (eng.includes('alphabet') || eng.includes('character')) return { meaningZhTW: '字母', isSuspicious: false };
  }

  // Ring
  if (word === 'ring') {
    if (eng.includes('jewelry') || eng.includes('finger')) return { meaningZhTW: '戒指', isSuspicious: false };
    if (eng.includes('circular') || eng.includes('band')) return { meaningZhTW: '環狀物；圈', isSuspicious: false };
    if (eng.includes('bell') || eng.includes('sound')) return { meaningZhTW: '（鐘鈴）響；按鈴', isSuspicious: false };
    if (eng.includes('telephone') || eng.includes('call')) return { meaningZhTW: '打電話給', isSuspicious: false };
  }

  // Flat
  if (word === 'flat') {
    if (eng.includes('apartment') || eng.includes('rooms')) return { meaningZhTW: '公寓（套房）', isSuspicious: false };
    if (eng.includes('level') || eng.includes('smooth')) return { meaningZhTW: '平坦的；扁平的', isSuspicious: false };
  }

  // Fine
  if (word === 'fine') {
    if (eng.includes('money') || eng.includes('penalty')) return { meaningZhTW: '罰金；罰款', isSuspicious: false };
    if (eng.includes('satisfactory') || eng.includes('good')) return { meaningZhTW: '美好的；優秀的', isSuspicious: false };
    if (eng.includes('delicate') || eng.includes('thin')) return { meaningZhTW: '細微的；精細的', isSuspicious: false };
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
  return {
    'ability%1:07:00::': '能力；本領',
    'ability%1:09:00::': '才能；才智',
    'able%3:00:00::': '能夠的；有能力的',
    'able%5:00:00:competent:00': '勝任的；有能力的',
    'able%5:00:00:capable:00': '有能力的；有才能的',
    'about%4:02:00::': '大約；大概',
    'about%4:02:06::': '周圍；到處',
    'about%4:02:01::': '在附近；在近處',
    'above%4:02:00::': '(文章中) 在前文；在上述',
    'above%4:02:01::': '在上方；向高處',
    'above%5:00:00:preceding:00': '上述的；前述的',
    'abroad%4:02:00::': '在國外；到國外',
    'abroad%4:02:02::': '在異鄉；離家',
    'abroad%4:02:01::': '在海外；在大洋彼岸',
  };
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
