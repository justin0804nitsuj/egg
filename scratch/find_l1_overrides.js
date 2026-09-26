const { execSync } = require('child_process');
const fs = require('fs');

const commits = ['82c55e2', '6426811', 'e8ad36a', 'f0e6d89', '333d224', '76e8ab9', 'a0c547d'];

commits.forEach(commit => {
  try {
    const files = execSync(`git ls-tree -r --name-only ${commit}`, { encoding: 'utf8' }).split('\n');
    console.log(`--- Commit ${commit} ---`);
    files.filter(f => f.includes('override') || f.includes('L1') || f.includes('report') || f.includes('json')).forEach(f => {
      try {
        const content = execSync(`git show ${commit}:${f}`, { encoding: 'utf8' });
        const matches = content.match(/"[^"]+%\d+:[^"]+"/g);
        if (matches && matches.length > 50) {
          console.log(`  File: ${f} -> found ${matches.length} sense keys`);
        }
      } catch(e) {}
    });
  } catch(e) {
    console.log(commit, e.message);
  }
});
