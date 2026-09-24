const childProcess = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

const DEFAULT_DOWNLOAD_URL =
  'https://en-word.net/downloads/english-wordnet-2025-json.zip';

const CACHE_DIR = path.join(PROJECT_ROOT, '.cache');
const DEFAULT_ZIP_PATH = path.join(
  CACHE_DIR,
  'english-wordnet-2025-json.zip'
);
const DEFAULT_EXTRACT_DIR = path.join(
  CACHE_DIR,
  'oewn-2025-json'
);

const OUTPUT_PATH = path.join(
  PROJECT_ROOT,
  'src',
  'data',
  'wordDefinitions.js'
);
const SAMPLE_REPORT_PATH = path.join(
  PROJECT_ROOT,
  'reports',
  'wordnet-import-100.json'
);
const FULL_REPORT_PATH = path.join(
  PROJECT_ROOT,
  'reports',
  'wordnet-import-all.json'
);

const SOURCE_ID = 'oewn-2025';

const SOURCE = {
  name: 'Open English WordNet',
  edition: '2025',
  url: 'https://en-word.net/downloads',
  dataUrl: DEFAULT_DOWNLOAD_URL,
  license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  derivedFrom: 'Princeton WordNet',
  derivedFromUrl: 'https://wordnet.princeton.edu/',
};

const SORTING = {
  strategy: 'oewn-entry-sense-order',
  description:
    'Definitions are ordered by app lookup candidate order, app POS order, then the original sense order in the OEWN entry JSON.',
  limitation:
    'The OEWN JSON export used here does not expose a reliable corpus frequency or learner-dictionary priority score for these senses; no frequency ranking is invented.',
};

const RUNTIME_DEFINITION_SCHEMA = [
  'id',
  'synsetId',
  'partOfSpeech',
  'partOfSpeechLabel',
  'lexicalFile',
  'definition',
  'source',
  'meaningZh',
  'translationStatus',
];

const POS_DISPLAY = {
  n: 'noun',
  v: 'verb',
  a: 'adjective',
  s: 'adjective',
  r: 'adverb',
};

const SUPPORTED_POS = new Set(['n', 'v', 'a', 's', 'r']);

function parseArgs(argv) {
  const options = {
    limit: 100,
    source: null,
    output: OUTPUT_PATH,
    report: SAMPLE_REPORT_PATH,
    reportProvided: false,
    downloadUrl: DEFAULT_DOWNLOAD_URL,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--limit') {
      options.limit = Number(argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--all') {
      options.limit = null;
      continue;
    }

    if (arg === '--source') {
      options.source = path.resolve(PROJECT_ROOT, argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--output') {
      options.output = path.resolve(PROJECT_ROOT, argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--report') {
      options.report = path.resolve(PROJECT_ROOT, argv[index + 1]);
      options.reportProvided = true;
      index += 1;
      continue;
    }

    if (arg === '--download-url') {
      options.downloadUrl = argv[index + 1];
      index += 1;
    }
  }

  if (
    options.limit !== null &&
    (!Number.isInteger(options.limit) || options.limit <= 0)
  ) {
    throw new Error('--limit must be a positive integer.');
  }

  if (
    options.limit === null &&
    !options.reportProvided
  ) {
    options.report = FULL_REPORT_PATH;
  }

  delete options.reportProvided;

  return options;
}

function ensureDirectory(directory) {
  fs.mkdirSync(directory, {
    recursive: true,
  });
}

function downloadFile(url, destination) {
  ensureDirectory(path.dirname(destination));

  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        response.resume();
        downloadFile(response.headers.location, destination)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(
          new Error(
            `Download failed with HTTP ${response.statusCode}: ${url}`
          )
        );
        return;
      }

      const output = fs.createWriteStream(destination);

      response.pipe(output);

      output.on('finish', () => {
        output.close(resolve);
      });

      output.on('error', reject);
    });

    request.on('error', reject);
  });
}

function hasWordNetJson(directory) {
  return (
    fs.existsSync(path.join(directory, 'entries-a.json')) &&
    fs.existsSync(path.join(directory, 'noun.act.json'))
  );
}

function extractZip(zipPath, destination) {
  ensureDirectory(destination);

  childProcess.execFileSync(
    'tar',
    ['-xf', zipPath, '-C', destination],
    {
      stdio: 'inherit',
    }
  );
}

async function resolveSourceDirectory(options) {
  if (options.source) {
    const stats = fs.statSync(options.source);

    if (stats.isDirectory()) {
      if (!hasWordNetJson(options.source)) {
        throw new Error(
          `Source directory does not look like OEWN JSON: ${options.source}`
        );
      }

      return options.source;
    }

    if (stats.isFile()) {
      extractZip(options.source, DEFAULT_EXTRACT_DIR);
      return DEFAULT_EXTRACT_DIR;
    }
  }

  if (hasWordNetJson(DEFAULT_EXTRACT_DIR)) {
    return DEFAULT_EXTRACT_DIR;
  }

  if (!fs.existsSync(DEFAULT_ZIP_PATH)) {
    console.log(`Downloading ${options.downloadUrl}`);
    await downloadFile(options.downloadUrl, DEFAULT_ZIP_PATH);
  }

  extractZip(DEFAULT_ZIP_PATH, DEFAULT_EXTRACT_DIR);

  return DEFAULT_EXTRACT_DIR;
}

function readJson(filePath) {
  return JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  );
}

function normalizeLookup(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\u2019`]/g, "'")
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ');
}

function expandParentheticalTerm(term) {
  const match = term.match(/^(.*)\(([^)]+)\)(.*)$/);

  if (!match) {
    return [term];
  }

  const [, before, inside, after] = match;

  return [
    `${before}${after}`,
    `${before}${inside}${after}`,
  ].filter(Boolean);
}

function getWordCandidates(wordText) {
  const rawParts = String(wordText ?? '')
    .split('/')
    .flatMap((part) => expandParentheticalTerm(part.trim()));

  const candidates = [];
  const seen = new Set();

  rawParts.forEach((part) => {
    const cleaned = part
      .trim()
      .replace(/^[^a-zA-Z]+|[^a-zA-Z. '-]+$/g, '')
      .replace(/\s+/g, ' ');

    if (!cleaned) {
      return;
    }

    const key = normalizeLookup(cleaned);

    if (!seen.has(key)) {
      seen.add(key);
      candidates.push(cleaned);
    }
  });

  return candidates;
}

function parseVocabularyPos(partOfSpeech) {
  const normalized = String(partOfSpeech ?? '')
    .toLowerCase()
    .replace(/[()]/g, '');

  const parts = normalized
    .split(/[\/,\s]+/)
    .map((part) => part.replace(/\.$/, ''))
    .filter(Boolean);

  const result = new Set();
  const order = [];
  const unsupportedParts = [];

  function add(pos) {
    if (!result.has(pos)) {
      order.push(pos);
    }

    result.add(pos);
  }

  parts.forEach((part) => {
    if (part === 'n') {
      add('n');
      return;
    }

    if (part === 'v') {
      add('v');
      return;
    }

    if (part === 'adj') {
      add('a');
      add('s');
      return;
    }

    if (part === 'adv') {
      add('r');
      return;
    }

    unsupportedParts.push(part);
  });

  return {
    set: result,
    order,
    unsupportedParts,
  };
}

function createEntryIndex(sourceDirectory) {
  const index = new Map();

  const files = fs
    .readdirSync(sourceDirectory)
    .filter((file) => /^entries-.*\.json$/.test(file));

  files.forEach((file) => {
    const entries = readJson(path.join(sourceDirectory, file));

    Object.entries(entries).forEach(([lemma, data]) => {
      index.set(normalizeLookup(lemma), {
        lemma,
        data,
      });
    });
  });

  return index;
}

function createSynsetIndex(sourceDirectory) {
  const synsets = new Map();

  const files = fs
    .readdirSync(sourceDirectory)
    .filter(
      (file) =>
        /^(noun|verb|adj|adv)\..*\.json$/.test(file)
    );

  files.forEach((file) => {
    const data = readJson(path.join(sourceDirectory, file));

    Object.entries(data).forEach(([id, synset]) => {
      synsets.set(id, {
        id,
        lexicalFile: file.replace(/\.json$/, ''),
        ...synset,
      });
    });
  });

  return synsets;
}

function getEntryPosKeys({
  entryData,
  posOrder,
  wantedPos,
}) {
  const keys = [];
  const seen = new Set();

  posOrder.forEach((pos) => {
    if (
      entryData[pos] &&
      !seen.has(pos)
    ) {
      keys.push(pos);
      seen.add(pos);
    }
  });

  Object.keys(entryData).forEach((pos) => {
    if (
      SUPPORTED_POS.has(pos) &&
      wantedPos.has(pos) &&
      !seen.has(pos)
    ) {
      keys.push(pos);
      seen.add(pos);
    }
  });

  return keys;
}

function getMatchingDefinitions({
  candidates,
  wantedPos,
  posOrder,
  entryIndex,
  synsetIndex,
}) {
  const definitions = [];
  const seen = new Set();

  candidates.forEach((candidate, candidateIndex) => {
    const entry = entryIndex.get(normalizeLookup(candidate));

    if (!entry) {
      return;
    }

    const entryPosKeys = getEntryPosKeys({
      entryData: entry.data,
      posOrder,
      wantedPos,
    });

    entryPosKeys.forEach((wordNetPos, posOrderIndex) => {
      const posData = entry.data[wordNetPos];
      const senses = Array.isArray(posData.sense)
        ? posData.sense
        : [];

      senses.forEach((sense, senseIndex) => {
        const synset = synsetIndex.get(sense.synset);

        if (!synset) {
          return;
        }

        const key = `${sense.id}:${synset.id}`;

        if (seen.has(key)) {
          return;
        }

        seen.add(key);

        definitions.push({
          id: sense.id,
          synsetId: synset.id,
          partOfSpeech: synset.partOfSpeech,
          partOfSpeechLabel:
            POS_DISPLAY[synset.partOfSpeech] ??
            synset.partOfSpeech,
          lexicalFile: synset.lexicalFile,
          matchedLemma: entry.lemma,
          matchedCandidate: candidate,
          definition: Array.isArray(synset.definition)
            ? synset.definition[0]
            : String(synset.definition ?? ''),
          source: SOURCE_ID,
          meaningZh: null,
          translationStatus: 'pending_review',
          sort: {
            candidateIndex,
            posOrderIndex,
            senseIndex,
          },
        });
      });
    });
  });

  return definitions;
}

async function loadWords() {
  const modulePath = pathToFileURL(
    path.join(PROJECT_ROOT, 'src', 'data', 'words.js')
  ).href;

  const { WORDS } = await import(modulePath);

  return WORDS;
}

function summarizeUnmatched(item) {
  if (item.supportedPos.length === 0) {
    return 'unsupported_pos';
  }

  if (item.candidates.length === 0) {
    return 'no_lookup_candidate';
  }

  return 'no_wordnet_sense_for_word_and_pos';
}

function compactDefinition(definition) {
  return [
    definition.id,
    definition.synsetId,
    definition.partOfSpeech,
    definition.partOfSpeechLabel,
    definition.lexicalFile,
    definition.definition,
    definition.source,
    definition.meaningZh,
    definition.translationStatus,
  ];
}

function getDefinitionBucket(count) {
  if (count === 0) {
    return '0';
  }

  if (count === 1) {
    return '1';
  }

  if (count <= 5) {
    return '2-5';
  }

  if (count <= 10) {
    return '6-10';
  }

  if (count <= 20) {
    return '11-20';
  }

  if (count <= 50) {
    return '21-50';
  }

  return '51+';
}

function getDefinitionCountStats(counts) {
  if (!counts.length) {
    return {
      min: 0,
      max: 0,
      average: 0,
      median: 0,
    };
  }

  const sorted = [...counts].sort(
    (a, b) => a - b
  );

  const middle = Math.floor(
    sorted.length / 2
  );

  const median =
    sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle];

  const total = sorted.reduce(
    (sum, count) => sum + count,
    0
  );

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    average: Number(
      (total / sorted.length).toFixed(2)
    ),
    median,
  };
}

function findDuplicateDefinitionGroups({
  word,
  definitions,
}) {
  const groups = new Map();

  definitions.forEach((definition) => {
    const key = [
      definition.partOfSpeech,
      normalizeLookup(
        definition.definition
      ),
    ].join(':');

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(
      definition
    );
  });

  return Array.from(groups.values())
    .filter((group) => group.length > 1)
    .map((group) => ({
      id: word.id,
      word: word.word,
      partOfSpeech:
        word.partOfSpeech,
      definition:
        group[0].definition,
      wordNetIds: group.map(
        (definition) =>
          definition.id
      ),
      synsetIds: group.map(
        (definition) =>
          definition.synsetId
      ),
    }));
}

function buildDictionary({
  words,
  limit,
  entryIndex,
  synsetIndex,
}) {
  const selectedWords =
    limit === null ? words : words.slice(0, limit);

  const dictionary = {};
  const unmatched = [];
  const ambiguous = [];
  const highDefinitionCountWords = [];
  const duplicateDefinitionGroups = [];
  const posMismatches = [];
  const emptyDefinitions = [];
  const unsupportedPartWarnings = [];
  const posTotals = {};
  const definitionCountBuckets = {};
  const definitionCounts = [];
  let definitionCount = 0;

  const highDefinitionThreshold = 20;

  selectedWords.forEach((word) => {
    const candidates = getWordCandidates(word.word);
    const posInfo = parseVocabularyPos(word.partOfSpeech);
    const wantedPos = posInfo.set;
    const definitions = getMatchingDefinitions({
      candidates,
      wantedPos,
      posOrder: posInfo.order,
      entryIndex,
      synsetIndex,
    });

    const supportedPos = Array.from(wantedPos).filter(
      (pos) => pos !== 's'
    );

    const definitionBucket =
      getDefinitionBucket(
        definitions.length
      );

    definitionCountBuckets[definitionBucket] =
      (definitionCountBuckets[definitionBucket] ?? 0) + 1;

    definitionCounts.push(
      definitions.length
    );

    if (
      posInfo.unsupportedParts.length > 0
    ) {
      unsupportedPartWarnings.push({
        id: word.id,
        word: word.word,
        partOfSpeech:
          word.partOfSpeech,
        unsupportedParts:
          posInfo.unsupportedParts,
        supportedPos,
      });
    }

    definitions.forEach((definition) => {
      definitionCount += 1;

      posTotals[definition.partOfSpeechLabel] =
        (posTotals[definition.partOfSpeechLabel] ?? 0) + 1;

      if (
        !wantedPos.has(
          definition.partOfSpeech
        )
      ) {
        posMismatches.push({
          id: word.id,
          word: word.word,
          appPartOfSpeech:
            word.partOfSpeech,
          wordNetId:
            definition.id,
          wordNetPartOfSpeech:
            definition.partOfSpeech,
          definition:
            definition.definition,
        });
      }

      if (
        !definition.definition ||
        !definition.definition.trim()
      ) {
        emptyDefinitions.push({
          id: word.id,
          word: word.word,
          wordNetId:
            definition.id,
          synsetId:
            definition.synsetId,
        });
      }
    });

    if (definitions.length > 0) {
      dictionary[word.id] =
        definitions.map(
          compactDefinition
        );
    }

    if (definitions.length === 0) {
      unmatched.push({
        id: word.id,
        word: word.word,
        partOfSpeech: word.partOfSpeech,
        level: word.level,
        candidates,
        supportedPos,
        unsupportedParts:
          posInfo.unsupportedParts,
        reason: summarizeUnmatched({
          candidates,
          supportedPos,
        }),
      });
    }

    if (definitions.length > 1) {
      ambiguous.push({
        id: word.id,
        word: word.word,
        partOfSpeech: word.partOfSpeech,
        definitionCount: definitions.length,
        wordNetPos: Array.from(
          new Set(
            definitions.map(
              (definition) => definition.partOfSpeechLabel
            )
          )
        ),
      });
    }

    if (
      definitions.length >
      highDefinitionThreshold
    ) {
      highDefinitionCountWords.push({
        id: word.id,
        word: word.word,
        partOfSpeech:
          word.partOfSpeech,
        level: word.level,
        definitionCount:
          definitions.length,
        wordNetPos: Array.from(
          new Set(
            definitions.map(
              (definition) =>
                definition.partOfSpeechLabel
            )
          )
        ),
      });
    }

    duplicateDefinitionGroups.push(
      ...findDuplicateDefinitionGroups({
        word,
        definitions,
      })
    );
  });

  const matchedWordCount =
    selectedWords.length - unmatched.length;

  return {
    selectedWords,
    dictionary,
    report: {
      generatedAt: new Date().toISOString(),
      scope:
        limit === null
          ? 'all-words'
          : `first-${limit}-words`,
      source: SOURCE,
      sorting: SORTING,
      runtimeDefinitionSchema:
        RUNTIME_DEFINITION_SCHEMA,
      totalWordsInApp: words.length,
      processedWordCount: selectedWords.length,
      matchedWordCount,
      unmatchedWordCount: unmatched.length,
      matchRate:
        selectedWords.length > 0
          ? Number(
              (
                (matchedWordCount / selectedWords.length) *
                100
              ).toFixed(2)
            )
          : 0,
      runtimeWordCount:
        Object.keys(dictionary).length,
      definitionCount,
      definitionCountStats:
        getDefinitionCountStats(
          definitionCounts
        ),
      definitionCountBuckets,
      wordsWithMultipleDefinitions: ambiguous.length,
      posTotals,
      unmatchedReasonTotals: unmatched.reduce(
        (totals, item) => ({
          ...totals,
          [item.reason]: (totals[item.reason] ?? 0) + 1,
        }),
        {}
      ),
      quality: {
        highDefinitionThreshold,
        posMismatchCount:
          posMismatches.length,
        duplicateDefinitionGroupCount:
          duplicateDefinitionGroups.length,
        emptyDefinitionCount:
          emptyDefinitions.length,
        highDefinitionCountWordCount:
          highDefinitionCountWords.length,
        unsupportedPartWarningCount:
          unsupportedPartWarnings.length,
      },
      unmatched,
      anomalies: {
        posMismatches,
        duplicateDefinitionGroups,
        emptyDefinitions,
        highDefinitionCountWords,
        unsupportedPartWarnings,
      },
      multipleDefinitionSamples:
        ambiguous.slice(0, 25),
    },
  };
}

function writeDictionaryFile({
  output,
  dictionary,
  report,
}) {
  ensureDirectory(path.dirname(output));

  const content = `// Generated by scripts/importWordNetDefinitions.cjs.
// The app keeps src/data/words.js as the source of truth for word IDs,
// levels, and original Chinese meanings.

export const WORD_DEFINITION_METADATA = ${JSON.stringify(
    {
      generatedAt: report.generatedAt,
      scope: report.scope,
      processedWordCount: report.processedWordCount,
      matchedWordCount: report.matchedWordCount,
      unmatchedWordCount: report.unmatchedWordCount,
      matchRate: report.matchRate,
      definitionCount: report.definitionCount,
      runtimeWordCount: report.runtimeWordCount,
      runtimeDefinitionSchema: report.runtimeDefinitionSchema,
      sorting: report.sorting,
      source: report.source,
    },
    null,
    2
  )};

export const WORD_DEFINITION_SCHEMA = ${JSON.stringify(
    RUNTIME_DEFINITION_SCHEMA,
    null,
    2
  )};

export const WORD_DEFINITIONS_BY_ID = ${JSON.stringify(
    dictionary,
    null,
    2
  )};

function expandDefinition(item) {
  const [
    id,
    synsetId,
    partOfSpeech,
    partOfSpeechLabel,
    lexicalFile,
    definition,
    source,
    meaningZh,
    translationStatus,
  ] = item;

  return {
    id,
    synsetId,
    partOfSpeech,
    partOfSpeechLabel,
    lexicalFile,
    definition,
    source,
    meaningZh,
    translationStatus,
  };
}

export function getWordDefinitions(wordId) {
  const definitions =
    WORD_DEFINITIONS_BY_ID[String(wordId)];

  if (!definitions) {
    return null;
  }

  return {
    definitions:
      definitions.map(
        expandDefinition
      ),
  };
}
`;

  fs.writeFileSync(output, content, 'utf8');
}

function writeReportFile({ report, output }) {
  ensureDirectory(path.dirname(output));
  fs.writeFileSync(
    output,
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8'
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const sourceDirectory = await resolveSourceDirectory(options);

  console.log(`Using OEWN JSON: ${sourceDirectory}`);

  const [words, entryIndex, synsetIndex] = await Promise.all([
    loadWords(),
    Promise.resolve(createEntryIndex(sourceDirectory)),
    Promise.resolve(createSynsetIndex(sourceDirectory)),
  ]);

  const { dictionary, report } = buildDictionary({
    words,
    limit: options.limit,
    entryIndex,
    synsetIndex,
  });

  writeDictionaryFile({
    output: options.output,
    dictionary,
    report,
  });

  writeReportFile({
    report,
    output: options.report,
  });

  console.log('');
  console.log(`Processed words: ${report.processedWordCount}`);
  console.log(`Matched words: ${report.matchedWordCount}`);
  console.log(`Unmatched words: ${report.unmatchedWordCount}`);
  console.log(`Match rate: ${report.matchRate}%`);
  console.log(`Definitions: ${report.definitionCount}`);
  console.log(`Dictionary: ${options.output}`);
  console.log(`Report: ${options.report}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
