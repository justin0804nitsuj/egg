const { execSync } = require('child_process');

const commits = execSync('git log --oneline').toString().trim().split('\n').map(l => l.split(' ')[0]);

commits.forEach(commit => {
  try {
    const content = execSync(`git show ${commit}:src/data/wordDefinitionsZhTW_L1_overrides.js`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
    const match = content.match(/"([^"]+%\d+[^"]+)":/g);
    const count = match ? match.length : 0;
    
    // Also check report if exists
    let reportObj = null;
    try {
      const rep = execSync(`git show ${commit}:reports/zhTW-level1-report.json`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
      reportObj = JSON.parse(rep);
    } catch (e) {}

    let corrObj = null;
    try {
      const corr = execSync(`git show ${commit}:reports/zhTW-level1-corrections.json`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
      corrObj = JSON.parse(corr);
    } catch (e) {}

    console.log(`Commit ${commit}: L1 overrides file keys=${count}, reportLearnerMeanings=${reportObj ? reportObj.learnerMeaningsAfterDeduplication : 'none'}, corrCount=${corrObj ? corrObj.corrections.length : 'none'}`);
  } catch (e) {
    console.log(`Commit ${commit}: no L1 overrides file`);
  }
});
