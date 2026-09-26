const { spawn } = require('child_process');

const child = spawn('git', ['show', 'e8ad36a'], { cwd: process.cwd() });

let buffer = '';
child.stdout.on('data', data => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop();
  lines.forEach(l => {
    if (l.includes('1028') || l.includes('1657') || l.includes('369') || l.includes('override')) {
      console.log(l);
    }
  });
});

child.on('close', code => {
  console.log('Finished with code', code);
});
