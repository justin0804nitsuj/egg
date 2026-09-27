const { execSync } = require('child_process');

const commits = execSync('git log --oneline').toString().trim().split('\n').map(l => l.split(' ')[0]);

commits.forEach(commit => {
  console.log(`=== Commit ${commit} ===`);
  ['L1', 'L2', 'L3', 'L4'].forEach(lvl => {
    const overrideFile = `src/data/wordDefinitionsZhTW_${lvl}_overrides.js`;
    const dictFile = `src/data/wordDefinitionsZhTW_${lvl}.js`;
    const reportFile = `reports/zhTW-level${lvl.slice(1)}-report.json`;

    let overridesCount = 'N/A';
    try {
      const content = execSync(`git show ${commit}:${overrideFile}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
      const match = content.match(/"([^"]+%\d+[^"]+)":/g);
      if (match) overridesCount = match.length;
    } catch (e) {}

    let learnerMeanings = 'N/A';
    try {
      const content = execSync(`git show ${commit}:${reportFile}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
      const json = JSON.parse(content);
      if (json.learnerMeaningsAfterDeduplication !== undefined) {
        learnerMeanings = json.learnerMeaningsAfterDeduplication;
      }
    } catch (e) {}

    console.log(`  ${lvl}: overrides=${overridesCount}, reportLearnerMeanings=${learnerMeanings}`);
  });
});
