const { execSync } = require('child_process');

try {
  const output = execSync('git log -S "369" --oneline', { encoding: 'utf8' });
  console.log('Commits mentioning 369:', output);
} catch(e) {
  console.log(e.message);
}

try {
  const output2 = execSync('git log -G "plane%1:25:00" --oneline', { encoding: 'utf8' });
  console.log('Commits with plane override:', output2);
} catch(e) {
  console.log(e.message);
}
