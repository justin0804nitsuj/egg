const { execSync } = require('child_process');

['333d224', '76e8ab9', 'e8ad36a'].forEach(c => {
  try {
    const show = execSync(`git show ${c} --stat`, { encoding: 'utf8' });
    console.log(`=== COMMIT ${c} ===`);
    console.log(show);
  } catch(e) {
    console.log(c, e.message);
  }
});
