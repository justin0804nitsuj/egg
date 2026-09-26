const { execSync } = require('child_process');

try {
  const out = execSync('git show e8ad36a', { encoding: 'utf8' });
  const lines = out.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('1028') || l.includes('1657') || l.includes('369')) {
      console.log(`Line ${i}:`, l);
    }
  });
} catch(e) {
  console.log(e.message);
}
