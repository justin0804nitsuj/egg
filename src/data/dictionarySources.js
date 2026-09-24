export const DICTIONARY_SOURCES = {
  openEnglishWordNet: {
    name: 'Open English WordNet',
    edition: '2025',
    url: 'https://en-word.net/downloads',
    license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    derivedFrom: 'Princeton WordNet',
    derivedFromUrl: 'https://wordnet.princeton.edu/',
  },

  cambridgeTraditional: {
    name: 'Cambridge Dictionary English-Chinese Traditional',
    url: 'https://dictionary.cambridge.org/dictionary/english-chinese-traditional/',
    usage: 'External online lookup only. Definitions and examples are not stored offline.',
  },
};

export function buildCambridgeTraditionalUrl(term) {
  const lookupTerm = String(term ?? '')
    .split('/')
    .map((part) => part.trim())
    .find(Boolean);

  const encodedTerm = encodeURIComponent(
    lookupTerm || String(term ?? '').trim()
  );

  return `${DICTIONARY_SOURCES.cambridgeTraditional.url}${encodedTerm}`;
}
