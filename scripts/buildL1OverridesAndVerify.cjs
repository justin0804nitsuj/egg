const { spawnSync } = require('child_process');
const path = require('path');

const res = spawnSync(process.execPath, [path.join(__dirname, 'buildOverridesAndVerify.cjs'), '--level', '1'], {
  stdio: 'inherit',
});
process.exit(res.status ?? 0);
