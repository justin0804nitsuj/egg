const { execSync } = require('child_process');

['1028', '1657', '1,028', '1,657'].forEach(term => {
  try {
    const out = execSync(`git log -S "${term}" --oneline`, { encoding: 'utf8' });
    console.log(`Search for '${term}':`);
    console.log(out);
  } catch(e) {}
});
