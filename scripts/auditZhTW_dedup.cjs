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
const AUDIT_JSON_PATH = path.join(PROJECT_ROOT, 'reports', `zhTW-level${level}-dedup-audit.json`);
const AUDIT_MD_PATH = path.join(PROJECT_ROOT, 'reports', `zhTW-level${level}-dedup-audit.md`);

// Domain keywords for semantic domain classification
const DOMAIN_MAP = {
  finance: ['money', 'bank', 'currency', 'coin', 'cash', 'price', 'fee', 'cost', 'pay', 'penalty', 'fine', 'financial', 'deposit', 'account', 'investor', 'market', 'stock', 'tax', 'bill', 'debt', 'capital', 'fund'],
  legal: ['law', 'court', 'crime', 'illegal', 'police', 'accusation', 'judge', 'legislative', 'statute', 'contract', 'witness', 'jury', 'guilty', 'trial', 'arrest'],
  geography: ['river', 'lake', 'ocean', 'sea', 'land', 'shore', 'slope', 'mountain', 'hill', 'valley', 'ground water', 'soil', 'island', 'coast', 'stream'],
  entertainment: ['play', 'drama', 'stage', 'theatre', 'theater', 'movie', 'film', 'music', 'instrument', 'actor', 'actress', 'performance', 'ballet', 'opera', 'sing', 'dance'],
  military: ['military', 'army', 'war', 'weapon', 'fight', 'combat', 'battle', 'soldier', 'engagement', 'gun', 'attack', 'hunting', 'troop', 'missile', 'cannon', 'shield'],
  physical_shatter: ['break', 'shatter', 'fracture', 'smash', 'destroy', 'snap', 'burst', 'split', 'crash'],
  time_season: ['season', 'spring', 'summer', 'autumn', 'winter', 'year', 'month', 'week', 'hour', 'minute', 'second', 'decade', 'century'],
  container: ['container', 'vessel', 'bottle', 'box', 'pot', 'jar', 'can', 'cup', 'pocket', 'bag', 'bin', 'tank', 'case'],
  clothing: ['garment', 'wear', 'cloth', 'shirt', 'pants', 'dress', 'shoe', 'hat', 'coat', 'suit', 'jacket', 'skirt', 'glove', 'boot'],
  transport: ['vehicle', 'car', 'bus', 'train', 'plane', 'ship', 'boat', 'drive', 'pilot', 'sail', 'aircraft', 'truck', 'railway', 'vessel'],
  mathematics: ['mathematics', 'geometry', 'equation', 'number', 'two-dimensional', 'angle', 'algebra', 'calculus', 'fraction', 'ratio'],
  medical: ['disease', 'illness', 'doctor', 'hospital', 'infection', 'virus', 'medicine', 'patient', 'symptom', 'treatment', 'medical', 'cure'],
};

function getSemanticDomains(eng) {
  const norm = eng.toLowerCase();
  const domains = new Set();

  Object.entries(DOMAIN_MAP).forEach(([domain, keywords]) => {
    if (keywords.some((kw) => norm.includes(kw))) {
      domains.add(domain);
    }
  });

  return Array.from(domains);
}

function classifyMergedGroup(group) {
  const defs = group.englishDefinitions;
  const word = group.word.toLowerCase();
  const pos = group.partOfSpeech;
  const meaning = group.meaningZhTW;

  // High priority Polysemous word checks
  const highPriorityCheck = checkHighPriorityPolysemy(word, pos, defs, meaning);
  if (highPriorityCheck) {
    return highPriorityCheck;
  }

  // Check semantic domain conflicts
  const domainSets = defs.map(getSemanticDomains);
  const activeDomains = new Set();
  domainSets.forEach((dArr) => dArr.forEach((d) => activeDomains.add(d)));

  const domainList = Array.from(activeDomains);

  if (
    (domainList.includes('finance') && domainList.includes('geography')) ||
    (domainList.includes('finance') && domainList.includes('container')) ||
    (domainList.includes('legal') && domainList.includes('entertainment')) ||
    (domainList.includes('military') && domainList.includes('entertainment')) ||
    (domainList.includes('physical_shatter') && domainList.includes('legal')) ||
    (domainList.includes('mathematics') && domainList.includes('transport')) ||
    (domainList.includes('medical') && domainList.includes('legal')) ||
    (domainList.includes('military') && !domainSets.every((ds) => ds.includes('military')))
  ) {
    return {
      classification: 'CLEAR_OVER_MERGE',
      explanation: `Underlying English definitions belong to incompatible semantic domains (${domainList.join(', ')}). Merging them loses critical meaning distinctions.`,
      suggestedSeparateMeanings: generateSuggestedMeanings(word, pos, defs, meaning),
    };
  }

  // Check if definitions describe distinct core actions or objects
  const coreActions = defs.map(extractCoreConcept);
  const distinctActions = Array.from(new Set(coreActions.filter(Boolean)));

  if (distinctActions.length > 1) {
    return {
      classification: 'POSSIBLE_OVER_MERGE',
      explanation: `English definitions convey distinct usages or core actions (${distinctActions.join(' vs ')}). High-school learners may benefit from separate entries or qualifiers.`,
      suggestedSeparateMeanings: generateSuggestedMeanings(word, pos, defs, meaning),
    };
  }

  // Default: SAFE_DUPLICATE
  return {
    classification: 'SAFE_DUPLICATE',
    explanation: 'English definitions represent closely related or near-identical senses within the same part of speech.',
    suggestedSeparateMeanings: null,
  };
}

function extractCoreConcept(def) {
  const norm = def.toLowerCase();
  if (norm.includes('vehicle with two wheels') && norm.includes('motor')) return 'motorcycle';
  if (norm.includes('vehicle with two wheels') && norm.includes('pedal')) return 'bicycle';
  if (norm.includes('game played') || norm.includes('sport')) return 'game_sport';
  if (norm.includes('inflated ball') || norm.includes('ball used')) return 'physical_ball';
  if (norm.startsWith('perform an action')) return 'perform_action';
  if (norm.startsWith('behave')) return 'behave_conduct';
  if (norm.startsWith('play a role')) return 'act_role';
  if (norm.startsWith('make') || norm.startsWith('create')) return 'create';
  if (norm.startsWith('destroy') || norm.startsWith('shatter')) return 'destroy';
  if (norm.startsWith('move')) return 'move';
  if (norm.startsWith('operate')) return 'operate';
  if (norm.startsWith('manage')) return 'manage';
  return null;
}

function checkHighPriorityPolysemy(word, pos, defs, meaning) {
  const normDefs = defs.map((d) => d.toLowerCase());

  // Generalized Polysemy Checks
  if (word === 'act') {
    if (normDefs.some((d) => d.includes('legal document')) && normDefs.some((d) => d.includes('play or opera'))) {
      return {
        classification: 'CLEAR_OVER_MERGE',
        explanation: 'Merges a legal document/statute ("法案") with a subdivision of a theatrical play ("幕").',
        suggestedSeparateMeanings: ['法案；條例', '（戲劇的）幕', '行動；行為'],
      };
    }
    if (normDefs.some((d) => d.includes('behave')) && normDefs.some((d) => d.includes('play a role'))) {
      return {
        classification: 'POSSIBLE_OVER_MERGE',
        explanation: 'Merges behavioral conduct ("表現；舉止") with acting a role on stage ("扮演；演戲").',
        suggestedSeparateMeanings: ['表現；舉止', '扮演；演戲', '採取行動'],
      };
    }
  }

  if (word === 'bank') {
    if (normDefs.some((d) => d.includes('financial')) && normDefs.some((d) => d.includes('sloping land'))) {
      return {
        classification: 'CLEAR_OVER_MERGE',
        explanation: 'Merges a financial institution ("銀行") with a river bank / slope ("河岸；堤岸").',
        suggestedSeparateMeanings: ['銀行', '河岸；堤岸', '存錢筒'],
      };
    }
  }

  return null;
}

function generateSuggestedMeanings(word, pos, defs, meaning) {
  return defs.map((d, i) => {
    const norm = d.toLowerCase();
    if (norm.includes('mathematics') || norm.includes('two-dimensional')) return `${meaning}（數學平面）`;
    if (norm.includes('investor')) return '空頭；看跌者';
    if (norm.includes('ball used') || norm.includes('inflated ball')) return `${meaning}（球體）`;
    if (norm.includes('game played') || norm.includes('court')) return `${meaning}運動`;
    if (norm.includes('instrument') && norm.includes('fighting')) return '武器；兵器';
    if (norm.includes('projection that is thought')) return '分支；把手';
    if (norm.includes('motor vehicle')) return '機車；摩托車';
    if (norm.includes('wheeled vehicle') && norm.includes('pedal')) return '腳踏車';
    return `${meaning} (義項 ${i + 1})`;
  });
}

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;

  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions, normalizeChineseMeaning } = await import(wordDefsPath);

  const levelWords = WORDS.filter((w) => w.level === level);
  const mergedGroups = [];

  levelWords.forEach((w) => {
    const res = getWordDefinitions(w.id);
    if (res && res.rawPrimaryDefinitions) {
      const rawDefs = res.rawPrimaryDefinitions;
      const keyMap = new Map();

      rawDefs.forEach((def) => {
        const posKey = def.partOfSpeechLabel || def.partOfSpeech || 'other';
        const chinese = def.chineseDefinition || def.meaningZh || '';
        const normZh = normalizeChineseMeaning(chinese);
        const key = normZh ? `${posKey}:${normZh}` : `${posKey}:raw:${def.id}`;

        if (!keyMap.has(key)) {
          keyMap.set(key, {
            wordId: w.id,
            word: w.word,
            partOfSpeech: posKey,
            meaningZhTW: chinese,
            normalizedMeaning: normZh,
            primarySenseId: def.id,
            sourceSenseIds: [def.id],
            synsetIds: [def.synsetId],
            lexicalFiles: [def.lexicalFile],
            englishDefinitions: [def.englishDefinition || def.definition],
          });
        } else {
          const group = keyMap.get(key);
          group.sourceSenseIds.push(def.id);
          group.synsetIds.push(def.synsetId);
          group.lexicalFiles.push(def.lexicalFile);
          group.englishDefinitions.push(def.englishDefinition || def.definition);
        }
      });

      keyMap.forEach((group) => {
        if (group.sourceSenseIds.length > 1) {
          mergedGroups.push(group);
        }
      });
    }
  });

  console.log(`Auditing ${mergedGroups.length} merged duplicate groups for Level ${level}...`);

  let safeCount = 0;
  let possibleCount = 0;
  let clearCount = 0;

  const auditedGroups = [];
  const questionableGroups = [];
  const wordQuestionableCounts = {};

  mergedGroups.forEach((group) => {
    const { classification, explanation, suggestedSeparateMeanings } = classifyMergedGroup(group);

    const auditItem = {
      wordId: group.wordId,
      word: group.word,
      partOfSpeech: group.partOfSpeech,
      currentMeaningZhTW: group.meaningZhTW,
      sourceSenseIds: group.sourceSenseIds,
      englishDefinitions: group.englishDefinitions,
      classification,
      explanation,
      suggestedSeparateMeanings,
    };

    auditedGroups.push(auditItem);

    if (classification === 'SAFE_DUPLICATE') {
      safeCount += 1;
    } else {
      if (classification === 'POSSIBLE_OVER_MERGE') {
        possibleCount += 1;
      } else if (classification === 'CLEAR_OVER_MERGE') {
        clearCount += 1;
      }

      questionableGroups.push(auditItem);
      wordQuestionableCounts[group.word] = (wordQuestionableCounts[group.word] || 0) + 1;
    }
  });

  const affectedWords = Array.from(new Set(mergedGroups.map((g) => g.word)));

  // Rank top words needing review by number of questionable over-merges
  const top20WordsNeedingReview = Object.entries(wordQuestionableCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, questionableGroupCount: count }));

  console.log(`Total Merged Groups: ${mergedGroups.length}`);
  console.log(`SAFE_DUPLICATE: ${safeCount}`);
  console.log(`POSSIBLE_OVER_MERGE: ${possibleCount}`);
  console.log(`CLEAR_OVER_MERGE: ${clearCount}`);
  console.log(`Top Words Needing Review Count: ${top20WordsNeedingReview.length}`);

  // 1. Write Audit JSON
  const auditJsonData = {
    generatedAt: new Date().toISOString(),
    scope: `level-${level}-only`,
    totalMergedGroups: mergedGroups.length,
    safeDuplicateCount: safeCount,
    possibleOverMergeCount: possibleCount,
    clearOverMergeCount: clearCount,
    affectedWordsCount: affectedWords.length,
    top20WordsNeedingReview,
    questionableGroupsCount: questionableGroups.length,
    allQuestionableGroups: questionableGroups,
  };

  fs.writeFileSync(AUDIT_JSON_PATH, JSON.stringify(auditJsonData, null, 2), 'utf8');
  console.log(`Wrote ${AUDIT_JSON_PATH} (${fs.statSync(AUDIT_JSON_PATH).size} bytes)`);

  // 2. Write Audit Markdown Report
  const mdContent = generateMarkdownReport({
    level,
    totalMergedGroups: mergedGroups.length,
    safeCount,
    possibleCount,
    clearCount,
    affectedWordsCount: affectedWords.length,
    top20WordsNeedingReview,
    questionableGroups,
  });

  fs.writeFileSync(AUDIT_MD_PATH, mdContent, 'utf8');
  console.log(`Wrote ${AUDIT_MD_PATH} (${fs.statSync(AUDIT_MD_PATH).size} bytes)`);
}

function generateMarkdownReport({
  level,
  totalMergedGroups,
  safeCount,
  possibleCount,
  clearCount,
  affectedWordsCount,
  top20WordsNeedingReview,
  questionableGroups,
}) {
  return `# Level ${level} Traditional Chinese Learner-Meaning Deduplication Audit Report

This report presents a thorough linguistic audit of all **${totalMergedGroups}** merged duplicate sense groups in Level ${level} vocabulary.

---

## 1. Summary Statistics

| Metric | Count | Percentage |
| :--- | :---: | :---: |
| **Total Merged Groups Audited** | **${totalMergedGroups}** | 100% |
| **SAFE_DUPLICATE** (Valid mergers) | **${safeCount}** | ${totalMergedGroups > 0 ? ((safeCount / totalMergedGroups) * 100).toFixed(1) : 0}% |
| **POSSIBLE_OVER_MERGE** (Nuanced / distinct usage) | **${possibleCount}** | ${totalMergedGroups > 0 ? ((possibleCount / totalMergedGroups) * 100).toFixed(1) : 0}% |
| **CLEAR_OVER_MERGE** (Must be separated) | **${clearCount}** | ${totalMergedGroups > 0 ? ((clearCount / totalMergedGroups) * 100).toFixed(1) : 0}% |
| **Total Affected Words** | **${affectedWordsCount}** | - |

---

## 2. Top Words Needing Review

These words contain questionable mergers where distinct concepts were collapsed under identical Chinese translations:

${top20WordsNeedingReview.length > 0
  ? top20WordsNeedingReview
      .map((w, i) => `${i + 1}. **${w.word}** (${w.questionableGroupCount} questionable group${w.questionableGroupCount > 1 ? 's' : ''})`)
      .join('\n')
  : '_None! All merged groups are classified as SAFE_DUPLICATE._'}

---

## 3. Questionable Over-Merge Examples & Audit Detail

${questionableGroups.length > 0
  ? questionableGroups
      .slice(0, 35)
      .map(
        (g, i) => `### ${i + 1}. \`${g.word}\` (${g.partOfSpeech}) - [${g.classification}]
- **Current Chinese Meaning**: \`${g.currentMeaningZhTW}\`
- **Source Sense IDs**: ${g.sourceSenseIds.map((id) => `\`${id}\``).join(', ')}
- **English Definitions**:
${g.englishDefinitions.map((d, idx) => `  ${idx + 1}. *"${d}"*`).join('\n')}
- **Audit Explanation**: ${g.explanation}
${
  g.suggestedSeparateMeanings
    ? `- **Suggested Differentiated Meanings**: ${g.suggestedSeparateMeanings.map((m) => `\`${m}\``).join(' | ')}`
    : ''
}
`
      )
      .join('\n---\n\n')
  : '_None! No questionable over-merges found._'}
`;
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { classifyMergedGroup, main };

