const { execSync } = require('child_process');

function getGitFile(commit, filePath) {
  try {
    return execSync(`git show ${commit}:${filePath}`, { maxBuffer: 50 * 1024 * 1024 }).toString();
  } catch (e) {
    return null;
  }
}

['reports/zhTW-level1-report.json', 'reports/zhTW-level2-report.json', 'reports/zhTW-level3-report.json', 'reports/zhTW-level4-report.json'].forEach(r => {
  console.log('--- ' + r + ' ---');
  const c82 = getGitFile('82c55e2', r);
  const c81 = getGitFile('81712e4', r);
  if (c82) {
    const d = JSON.parse(c82);
    console.log('82c55e2:', {
      translatedRawSenseCount: d.translatedRawSenseCount,
      learnerMeaningsBeforeDeduplication: d.learnerMeaningsBeforeDeduplication,
      learnerMeaningsAfterDeduplication: d.learnerMeaningsAfterDeduplication,
      duplicatesRemovedFromDisplay: d.duplicatesRemovedFromDisplay,
    });
  } else {
    console.log('82c55e2: NONE');
  }
  if (c81) {
    const d = JSON.parse(c81);
    console.log('81712e4:', {
      translatedRawSenseCount: d.translatedRawSenseCount,
      learnerMeaningsBeforeDeduplication: d.learnerMeaningsBeforeDeduplication,
      learnerMeaningsAfterDeduplication: d.learnerMeaningsAfterDeduplication,
      duplicatesRemovedFromDisplay: d.duplicatesRemovedFromDisplay,
    });
  } else {
    console.log('81712e4: NONE');
  }
});
