const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Searching repo for baseline numbers ---');

function searchInDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!f.startsWith('.') && f !== 'node_modules') searchInDir(full);
    } else {
      if (f.endsWith('.md') || f.endsWith('.json') || f.endsWith('.cjs') || f.endsWith('.js')) {
        const text = fs.readFileSync(full, 'utf8');
        if (text.includes('1657') || text.includes('369') || text.includes('1497') || text.includes('1313')) {
          console.log(`Found in ${full}:`);
          text.split('\n').forEach((line, idx) => {
            if (line.includes('1657') || line.includes('369') || line.includes('1497') || line.includes('1313')) {
              console.log(`  Line ${idx + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  });
}

searchInDir('.');
