const { execSync } = require('child_process');

const commits = ['82c55e2', '6426811', 'e8ad36a', 'f0e6d89', '333d224', '76e8ab9', 'a0c547d', 'cb1b410', 'be28ade', '385af2a'];

commits.forEach(c => {
  try {
    const log = execSync(`git show ${c}`, { encoding: 'utf8' });
    if (log.includes('369')) {
      console.log(`Commit ${c} contains '369'`);
      const lines = log.split('\n').filter(l => l.includes('369'));
      lines.forEach(l => console.log('  ', l.trim()));
    }
  } catch(e) {}
});
