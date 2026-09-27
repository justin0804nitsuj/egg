const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;
  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  const l1Words = WORDS.filter(w => w.level === 1);
  const l1OverridesAll = (await import(pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L1_overrides.js')).href)).ZH_TW_L1_OVERRIDES;

  const l1ManualOverrides = {};
  Object.entries(l1OverridesAll).forEach(([k, v]) => {
    if (typeof v === 'object' && v.reason && !v.reason.includes('Auto-differentiated')) {
      l1ManualOverrides[k] = v;
    }
  });

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

  function translateSense(def, wordObj, explicitOverrides, index, totalSenses) {
    const senseId = def.id;
    const english = def.englishDefinition || def.definition || '';
    const pos = def.partOfSpeechLabel || def.partOfSpeech || '';
    const originalMeaning = wordObj.meaning;

    if (explicitOverrides[senseId]) {
      const ov = explicitOverrides[senseId];
      return typeof ov === 'string' ? ov : ov.meaningZhTW;
    }

    const normEng = english.toLowerCase().trim();
    const wordLower = wordObj.word.toLowerCase();

    // pattern matching
    if (engIncludes(normEng, 'quality of being able to perform')) return '能力；本領';
    if (engIncludes(normEng, 'possession of the qualities') && engIncludes(normEng, 'mental')) return '才能；才智';
    if (engIncludes(normEng, 'imprecise but fairly close to correct')) return '大約；大概';
    if (engIncludes(normEng, 'all around or on all sides')) return '到處；周圍';
    if (engIncludes(normEng, 'in or to a foreign country')) return '在國外；到國外';
    if (engIncludes(normEng, 'a person who') || engIncludes(normEng, 'someone who')) {
      let cleanOrig = originalMeaning.split('/')[0].split(';')[0].trim();
      if (cleanOrig.endsWith('人') || cleanOrig.endsWith('員') || cleanOrig.endsWith('家')) return cleanOrig;
      return cleanOrig + '（人）';
    }
    if (engIncludes(normEng, 'a device') || engIncludes(normEng, 'an instrument') || engIncludes(normEng, 'a tool')) {
      return originalMeaning.split('/')[0].split(';')[0].trim();
    }

    // fallback adapt
    if (!originalMeaning) return '未知';
    let parts = originalMeaning.split(/[\/,;]/).map((p) => p.trim()).filter(Boolean);
    if (totalSenses === 1) return parts.join('；');
    if (parts.length > index) return parts[index];
    return parts[0];
  }

  function engIncludes(str, target) { return str.includes(target); }

  function runPipeline(overridesMap) {
    let totalPrimarySenses = 0;
    let totalLearnerMeanings = 0;
    const groups = [];

    l1Words.forEach(word => {
      const entry = getWordDefinitions(word.id);
      if (!entry || (!entry.primaryDefinitions && !entry.rawPrimaryDefinitions)) return;
      const primaryDefs = entry.rawPrimaryDefinitions || entry.primaryDefinitions;
      totalPrimarySenses += primaryDefs.length;

      const keyMap = new Map();

      primaryDefs.forEach((def, index) => {
        const rawZh = translateSense(def, word, overridesMap, index, primaryDefs.length);
        const chinese = applyTaiwanTerms(rawZh);
        const posKey = def.partOfSpeechLabel || def.partOfSpeech || 'other';
        const normZh = normalizeChineseMeaning(chinese);
        const key = normZh ? `${posKey}:${normZh}` : `${posKey}:raw:${def.id}`;

        if (!keyMap.has(key)) {
          const group = {
            wordId: word.id,
            word: word.word,
            pos: posKey,
            meaningZhTW: chinese,
            primarySenseId: def.id,
            sourceSenseIds: [def.id],
            englishDefinitions: [def.englishDefinition || def.definition],
          };
          keyMap.set(key, group);
          groups.push(group);
        } else {
          const existing = keyMap.get(key);
          existing.sourceSenseIds.push(def.id);
          existing.englishDefinitions.push(def.englishDefinition || def.definition);
        }
      });

      totalLearnerMeanings += keyMap.size;
    });

    return { totalPrimarySenses, totalLearnerMeanings, groups };
  }

  const runNoOverrides = runPipeline({});
  const runManual = runPipeline(l1ManualOverrides);
  const runAll = runPipeline(l1OverridesAll);

  console.log('--- Pipeline Run Results ---');
  console.log('1. No Overrides:          Learner Meanings =', runNoOverrides.totalLearnerMeanings);
  console.log('2. Manual (178 keys):     Learner Meanings =', runManual.totalLearnerMeanings);
  console.log('3. All (415 keys):        Learner Meanings =', runAll.totalLearnerMeanings);
}

main().catch(console.error);
