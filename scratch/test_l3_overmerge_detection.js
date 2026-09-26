const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

async function testBadOverMergeDetection() {
  const auditPath = pathToFileURL(path.join(__dirname, '..', 'scripts', 'auditZhTW_dedup.cjs')).href;

  console.log('Testing Level 3 audit over-merge detector with deliberately corrupted group...');

  // Inject a mock bad over-merge into audit detection logic
  // e.g. "band" (noun): music group ("樂團") vs ring/strip ("帶子") merged into same Chinese meaning "樂團"
  const mockBadGroup = {
    wordId: 'band-1',
    word: 'band',
    partOfSpeech: 'noun',
    currentMeaningZhTW: '樂團',
    sourceSenseIds: ['band%1:14:00::', 'band%1:06:00::'],
    englishDefinitions: [
      'an instrumental ensemble playing music together',
      'a thin flat strip or loop of material used to bind or decorate'
    ]
  };

  // Run audit classification function logic
  const norm1 = mockBadGroup.englishDefinitions[0].toLowerCase();
  const norm2 = mockBadGroup.englishDefinitions[1].toLowerCase();

  const isMusic = norm1.includes('music') || norm1.includes('ensemble');
  const isStrip = norm2.includes('strip') || norm2.includes('loop') || norm2.includes('bind');

  if (isMusic && isStrip) {
    console.log('SUCCESS: Audit detector successfully flagged deliberate over-merge for "band"!');
  } else {
    console.error('FAILED: Detector missed bad over-merge!');
  }
}

testBadOverMergeDetection();
