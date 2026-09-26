const { execSync } = require('child_process');
const fs = require('fs');

const commits = ['82c55e2', '6426811', 'e8ad36a', 'f0e6d89', '333d224'];

commits.forEach(commit => {
  try {
    const js = execSync(`git show ${commit}:src/data/wordDefinitionsZhTW_L1_overrides.js`, { encoding: 'utf8' });
    // parse object from export const ZH_TW_L1_OVERRIDES = { ... };
    const match = js.match(/export const ZH_TW_L1_OVERRIDES = (\{[\s\S]*\});/);
    if (match) {
      const obj = eval('(' + match[1] + ')');
      console.log(commit, 'keys count:', Object.keys(obj).length);
    } else {
      console.log(commit, 'no match');
    }
  } catch(e) {
    console.log(commit, 'err:', e.message);
  }
});
