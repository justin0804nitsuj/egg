const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');

async function main() {
  console.log('--- Testing Pipeline Rebuild in Correct Order ---');

  for (const level of [1, 2, 3, 4]) {
    console.log(`\n=== Processing Level ${level} ===`);
    // 1. Generate zhTW dictionary using verified overrides
    execSync(`node scripts/generateZhTW.cjs --level ${level}`, { cwd: PROJECT_ROOT, stdio: 'inherit' });
    // 2. Audit deduplication to produce zhTW-levelN-dedup-audit.json
    execSync(`node scripts/auditZhTW_dedup.cjs --level ${level}`, { cwd: PROJECT_ROOT, stdio: 'inherit' });
    // 3. Build verified overrides file & override suggestions report from audit data
    execSync(`node scripts/buildOverridesAndVerify.cjs --level ${level}`, { cwd: PROJECT_ROOT, stdio: 'inherit' });
  }
}

main().catch(console.error);
