const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;
  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  // Load LEVEL_MANUAL_OVERRIDES
  const buildScript = fs.readFileSync(path.join(PROJECT_ROOT, 'scripts', 'buildOverridesAndVerify.cjs'), 'utf8');
  const start = buildScript.indexOf('const LEVEL_MANUAL_OVERRIDES = {');
  const end = buildScript.indexOf('function autoDifferentiateSense');
  const manualOverridesCode = buildScript.slice(start, end);
  const LEVEL_MANUAL_OVERRIDES = (new Function(`${manualOverridesCode}; return LEVEL_MANUAL_OVERRIDES;`))();

  const TAIWAN_VOCAB_MAP = {
    '軟件': '軟體', '程序的': '程式的', '程序': '程式', '出租車': '計程車',
    '公共汽車': '公車', '視頻': '影片', '打印': '列印', '內存': '記憶體',
    '網絡': '網路', '信箱': '郵箱', '信息': '資訊', '硬盤': '硬碟',
    '鼠標': '滑鼠', '數碼': '數位', '屏幕': '螢幕', '服務器': '伺服器',
    '智能': '智慧型', '幼兒園': '幼稚園', '塑料': '塑膠', '黃油': '奶油',
    '吐司': '吐司', '便當': '便當', '黃瓜': '小黃瓜', '菠蘿': '鳳梨',
    '三文魚': '鮭魚', '金槍魚': '鮪魚', '方便面': '泡麵', '公交車': '公車',
    '地鐵': '捷運', '自行車': '腳踏車', '摩托車': '機車',
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
    return meaning.trim().replace(/\s+/g, ' ').replace(/[，、；;。.]$/g, '').trim();
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
      if (cleanOrig.endsWith('人') || cleanOrig.endsWith('員') || cleanOrig.endsWith('家')) return cleanOrig;
      return cleanOrig + '（人）';
    }
    if (eng.includes('a device') || eng.includes('an instrument') || eng.includes('a tool')) {
      return orig.split('/')[0].split(';')[0].trim();
    }
    return null;
  }

  function adaptOriginalMeaningForSense(word, pos, originalMeaning, english, senseIndex, totalSenses) {
    if (!originalMeaning) return '未知';
    let parts = originalMeaning.split(/[\/,;]/).map((p) => p.trim()).filter(Boolean);
    if (totalSenses === 1) return parts.join('；');
    if (parts.length > senseIndex) return parts[senseIndex];
    return parts[0];
  }

  function translateSense(def, wordObj, verifiedOverridesMap, index, totalSenses) {
    const senseId = def.id;
    const english = def.englishDefinition || def.definition || '';
    const pos = def.partOfSpeechLabel || def.partOfSpeech || '';
    const originalMeaning = wordObj.meaning;

    // ONLY VERIFIED OVERRIDES
    if (verifiedOverridesMap[senseId]) {
      const ov = verifiedOverridesMap[senseId];
      if (typeof ov === 'string') return ov;
      if (ov.status === 'verified') return ov.meaningZhTW;
    }

    const normEng = english.toLowerCase().trim();
    const wordLower = wordObj.word.toLowerCase();

    const disambiguation = disambiguateWordSense(wordLower, pos, normEng, originalMeaning, index, totalSenses, def.lexicalFile);
    if (disambiguation) return disambiguation.meaningZhTW;

    const patternMeaning = translateByPattern(wordLower, pos, normEng, originalMeaning, def.lexicalFile);
    if (patternMeaning) return patternMeaning;

    return adaptOriginalMeaningForSense(wordLower, pos, originalMeaning, normEng, index, totalSenses);
  }

  // Audit classifier matching auditZhTW_dedup.cjs
  function classifyMergedGroup(g) {
    const normDefs = g.englishDefinitions.map(d => d.toLowerCase());
    const domainKeywords = ['financial', 'bank', 'money', 'legal', 'statute', 'court', 'military', 'war', 'medical', 'disease', 'nautical', 'ship', 'geometry', 'mathematics'];
    
    let domainMismatch = false;
    for (let i = 0; i < normDefs.length; i++) {
      for (let j = i + 1; j < normDefs.length; j++) {
        const d1 = normDefs[i];
        const d2 = normDefs[j];
        domainKeywords.forEach(kw => {
          if ((d1.includes(kw) && !d2.includes(kw)) || (!d1.includes(kw) && d2.includes(kw))) {
            domainMismatch = true;
          }
        });
      }
    }

    if (domainMismatch) return 'CLEAR_OVER_MERGE';

    let maxLength = 0;
    let minLength = Infinity;
    normDefs.forEach(d => {
      maxLength = Math.max(maxLength, d.length);
      minLength = Math.min(minLength, d.length);
    });

    if (maxLength - minLength > 80) return 'POSSIBLE_OVER_MERGE';
    return 'SAFE_DUPLICATE';
  }

  const results = {};

  for (const level of [1, 2, 3, 4]) {
    const verifiedMap = LEVEL_MANUAL_OVERRIDES[level] || {};
    const levelWords = WORDS.filter(w => w.level === level);
    const matchedWordCount = levelWords.filter(w => getWordDefinitions(w.id)).length;

    let totalRawPrimarySenses = 0;
    let totalTranslatedSenses = 0;
    let affectedSourceSenseInstances = 0;
    const rawDefsByWord = [];

    levelWords.forEach(word => {
      const entry = getWordDefinitions(word.id);
      if (!entry) return;
      const primaryDefs = entry.rawPrimaryDefinitions || entry.primaryDefinitions || [];
      if (primaryDefs.length === 0) return;

      totalRawPrimarySenses += primaryDefs.length;

      const wordSenses = [];
      primaryDefs.forEach((def, index) => {
        if (verifiedMap[def.id]) affectedSourceSenseInstances++;

        const meaningZhTW = translateSense(def, word, verifiedMap, index, primaryDefs.length);
        const cleanMeaning = applyTaiwanTerms(meaningZhTW);
        if (cleanMeaning) totalTranslatedSenses++;

        wordSenses.push({
          ...def,
          chineseDefinition: cleanMeaning,
          meaningZh: cleanMeaning,
        });
      });

      rawDefsByWord.push({
        wordId: word.id,
        word: word.word,
        senses: wordSenses,
      });
    });

    // Deduplication
    let totalLearnerMeaningsAfter = 0;
    let duplicatesRemoved = 0;
    let safeCount = 0;
    let possibleCount = 0;
    let clearCount = 0;
    const questionableGroups = [];

    rawDefsByWord.forEach(w => {
      const keyMap = new Map();
      const dedupedGroups = [];

      w.senses.forEach(def => {
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

      // Classify merged groups
      dedupedGroups.forEach(g => {
        if (g.sourceSenseIds.length > 1) {
          const classification = classifyMergedGroup(g);
          if (classification === 'SAFE_DUPLICATE') safeCount++;
          if (classification === 'POSSIBLE_OVER_MERGE') possibleCount++;
          if (classification === 'CLEAR_OVER_MERGE') clearCount++;

          if (classification !== 'SAFE_DUPLICATE') {
            questionableGroups.push({ ...g, classification });
          }
        }
      });
    });

    duplicatesRemoved = totalRawPrimarySenses - totalLearnerMeaningsAfter;

    results[level] = {
      level,
      wordCount: levelWords.length,
      matchedWords: matchedWordCount,
      rawPrimarySenses: totalRawPrimarySenses,
      translatedPrimarySenses: totalTranslatedSenses,
      productionLearnerMeanings: totalLearnerMeaningsAfter,
      verifiedOverrideKeys: Object.keys(verifiedMap).length,
      affectedSourceSenseInstances,
      autoDifferentiatedSuggestions: questionableGroups.length, // total suggestions produced by auto-differentiation
      duplicatesRemoved,
      safeDuplicates: safeCount,
      possibleOverMerges: possibleCount,
      clearOverMerges: clearCount,
      questionableGroups,
    };
  }

  console.log('\n========================================================================');
  console.log('       CANONICAL DICTIONARY METRICS FOR LEVELS 1 - 4                    ');
  console.log('========================================================================\n');

  console.table(Object.values(results).map(r => ({
    Level: r.level,
    Words: r.wordCount,
    Matched: r.matchedWords,
    RawSenses: r.rawPrimarySenses,
    LearnerMeanings: r.productionLearnerMeanings,
    VerifiedKeys: r.verifiedOverrideKeys,
    AffectedSenses: r.affectedSourceSenseInstances,
    AutoSuggestions: r.autoDifferentiatedSuggestions,
    DuplicatesRemoved: r.duplicatesRemoved,
    SAFE: r.safeDuplicates,
    POSSIBLE: r.possibleOverMerges,
    CLEAR: r.clearOverMerges,
  })));
}

main().catch(console.error);
