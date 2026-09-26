const { spawnSync } = require('child_process');
const path = require('path');

const res = spawnSync(process.execPath, [path.join(__dirname, 'auditZhTW_dedup.cjs'), '--level', '1'], {
  stdio: 'inherit',
});
process.exit(res.status ?? 0);
