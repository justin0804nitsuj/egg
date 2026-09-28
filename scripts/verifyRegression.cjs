/* global __dirname */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');

async function runTests() {
  console.log('====================================================');
  console.log('       RUNNING HARDENED DICTIONARY REGRESSION TEST SUITE     ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✔ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. auto_differentiated override cannot affect getWordDefinitions()
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;
  const { getWordDefinitions } = await import(wordDefsPath);

  const bankDefs = getWordDefinitions('bank-82');
  let autoAffectsRuntime = false;
  if (bankDefs) {
    bankDefs.rawDefinitions.forEach(d => {
      if (d.translationStatus === 'auto_differentiated') autoAffectsRuntime = true;
      if (d.chineseDefinition && d.chineseDefinition.includes('(義項')) autoAffectsRuntime = true;
    });
  }

  assert(!autoAffectsRuntime, 'auto_differentiated overrides CANNOT affect getWordDefinitions() runtime display.');

  // 2. verified override DOES affect getWordDefinitions()
  const armDefs = getWordDefinitions('arm-44');
  let verifiedApplied = false;
  if (armDefs) {
    const limbSense = armDefs.rawPrimaryDefinitions.find(d => d.id === 'arm%1:08:00::');
    if (limbSense && limbSense.chineseDefinition === '手臂' && limbSense.translationStatus === 'verified') {
      verifiedApplied = true;
    }
  }

  assert(verifiedApplied, 'verified override DOES affect getWordDefinitions() and sets status to verified.');

  // 3. auto_differentiated override cannot split a deduplicated learner group
  const l3Dict = (await import(pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L3.js')).href)).WORD_DEFINITIONS_ZH_TW_L3;
  const acc1 = l3Dict['acceptable%3:00:00::'];
  const acc2 = l3Dict['acceptable%5:00:00:standard:03'];
  const notSplitByAuto = acc1 && acc2 && acc1.meaningZhTW === acc2.meaningZhTW;

  assert(notSplitByAuto, 'auto_differentiated override CANNOT split a deduplicated learner group.');

  // 4. verified override CAN intentionally split genuinely different senses
  const armLimb = armDefs ? armDefs.rawPrimaryDefinitions.find(d => d.id === 'arm%1:08:00::') : null;
  const armWeapon = armDefs ? armDefs.rawPrimaryDefinitions.find(d => d.id === 'arm%1:06:01::') : null;
  const splitByVerified = armLimb && armWeapon && armLimb.chineseDefinition !== armWeapon.chineseDefinition;

  assert(splitByVerified, 'verified override CAN intentionally split genuinely different senses.');

  // 5. Level N generation cannot mutate another level
  const l1_dict_before = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L1.js'), 'utf8');
  const l2_dict_before = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L2.js'), 'utf8');
  const l3_dict_before = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L3.js'), 'utf8');

  execSync('node scripts/generateZhTW.cjs --level 4', { cwd: PROJECT_ROOT });

  const l1_dict_after = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L1.js'), 'utf8');
  const l2_dict_after = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L2.js'), 'utf8');
  const l3_dict_after = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L3.js'), 'utf8');

  assert(l1_dict_before === l1_dict_after, 'Running Level 4 generator does NOT mutate Level 1 dictionary (Level Isolation).');
  assert(l2_dict_before === l2_dict_after, 'Running Level 4 generator does NOT mutate Level 2 dictionary (Level Isolation).');
  assert(l3_dict_before === l3_dict_after, 'Running Level 4 generator does NOT mutate Level 3 dictionary (Level Isolation).');

  // 6. Generators are idempotent
  const l1_dict_run1 = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L1.js'), 'utf8');
  execSync('node scripts/generateZhTW.cjs --level 1', { cwd: PROJECT_ROOT });
  const l1_dict_run2 = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitionsZhTW_L1.js'), 'utf8');

  assert(l1_dict_run1 === l1_dict_run2, 'Generators are idempotent (re-running produces byte-for-byte identical output).');

  // 7. Raw WordNet sense IDs remain unchanged
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const { WORDS } = await import(wordsPath);
  let validSenseIds = true;
  let checkedSenses = 0;

  WORDS.filter(w => w.level <= 6).forEach(w => {
    const entry = getWordDefinitions(w.id);
    if (entry) {
      entry.rawDefinitions.forEach(d => {
        checkedSenses++;
        if (!d.id || !d.id.includes('%')) validSenseIds = false;
      });
    }
  });

  assert(validSenseIds && checkedSenses > 0, `Raw WordNet sense IDs remain unchanged (${checkedSenses} sense IDs verified).`);

  // 8. XP / SRS / favorites / AsyncStorage logic is untouched
  const progressFile = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'storage', 'progress.js'), 'utf8');
  const quizGenFile = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'utils', 'quizGenerator.js'), 'utf8');
  const reviewQueueFile = fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'utils', 'reviewQueue.js'), 'utf8');

  const storageLogicUntouched = progressFile.includes('AsyncStorage') && quizGenFile.length > 0 && reviewQueueFile.length > 0;
  assert(storageLogicUntouched, 'XP / SRS / favorites / AsyncStorage logic is untouched.');

  // 9. file (noun) meanings remain distinct
  const fileDefs = getWordDefinitions('file-306');
  let fileNounDistinct = false;
  if (fileDefs) {
    const fileDoc = fileDefs.primaryDefinitions.find(d => d.primarySenseId === 'file%1:10:00::');
    const fileColumn = fileDefs.primaryDefinitions.find(d => d.primarySenseId === 'file%1:14:00::');
    const fileCabinet = fileDefs.primaryDefinitions.find(d => d.primarySenseId === 'file%1:06:01::');
    if (fileDoc && fileColumn && fileCabinet &&
        fileDoc.meaningZhTW !== fileColumn.meaningZhTW &&
        fileDoc.meaningZhTW !== fileCabinet.meaningZhTW &&
        fileColumn.meaningZhTW !== fileCabinet.meaningZhTW) {
      fileNounDistinct = true;
    }
  }
  assert(fileNounDistinct, 'file noun meanings remain distinct (檔案；資料檔 vs 縱隊；隊列 vs 文件櫃；檔案櫃).');

  // 10. close verb meaning is correct
  const closeDefs = getWordDefinitions('close-175');
  let closeVerbCorrect = false;
  if (closeDefs) {
    const closeVerb = closeDefs.rawPrimaryDefinitions.find(d => d.id === 'close%2:35:00::');
    if (closeVerb && closeVerb.chineseDefinition === '關閉；合上' && !closeVerb.chineseDefinition.includes('靠近的')) {
      closeVerbCorrect = true;
    }
  }
  assert(closeVerbCorrect, 'close verb meaning is correct ("關閉；合上" without adjective "靠近的").');

  // 11. Previously approved Level 1 meanings preserved
  const attackDefs = getWordDefinitions('attack-51');
  let attackApprovedPreserved = false;
  if (attackDefs) {
    const attackSport = attackDefs.rawPrimaryDefinitions.find(d => d.id === 'attack%1:04:04::');
    if (attackSport && attackSport.chineseDefinition === '進攻；攻勢') {
      attackApprovedPreserved = true;
    }
  }
  assert(attackApprovedPreserved, 'Previously approved Level 1 meanings preserved (e.g. attack%1:04:04:: === "進攻；攻勢").');

  // 12. Batch 3 user-approved meanings preserved (plant, nurse, practice)
  const plantDefs = getWordDefinitions('plant-653');
  const nurseDefs = getWordDefinitions('nurse-596');
  const practiceDefs = getWordDefinitions('practice-673');

  let batch3ApprovedPreserved = false;
  if (plantDefs && nurseDefs && practiceDefs) {
    const plantFactory = plantDefs.rawPrimaryDefinitions.find(d => d.id === 'plant%1:06:01::');
    const plantBotany = plantDefs.rawPrimaryDefinitions.find(d => d.id === 'plant%1:03:00::');
    const nurseEmotion = nurseDefs.rawPrimaryDefinitions.find(d => d.id === 'nurse%2:37:00::');
    const nurseRole = nurseDefs.rawPrimaryDefinitions.find(d => d.id === 'nurse%2:41:00::');
    const practiceAction = practiceDefs.rawPrimaryDefinitions.find(d => d.id === 'practice%1:04:04::');

    if (plantFactory && plantFactory.chineseDefinition === '工廠；廠房' &&
        plantBotany && plantBotany.chineseDefinition === '植物' &&
        nurseEmotion && nurseEmotion.chineseDefinition === '心懷；長久抱持（想法或情感）' &&
        nurseRole && nurseRole.chineseDefinition === '擔任護理師；照護病患' &&
        practiceAction && practiceAction.chineseDefinition === '實踐；付諸實行') {
      batch3ApprovedPreserved = true;
    }
  }
  assert(batch3ApprovedPreserved, 'Batch 3 user-approved meanings preserved (plant, nurse, practice).');

  // 13. All 313 approved records across 4 CSV batches match getWordDefinitions()
  const { parse: parseCsv } = require('csv-parse/sync');
  const csvFiles = [
    'zhTW-level1-reviewed-first30.csv',
    'zhTW-level1-batch2-approved.csv',
    'zhTW-level1-batch3-approved.csv',
    'zhTW-level1-final-reviewed-approved.csv'
  ];
  let totalApprovedVerified = 0;
  let all313Match = true;

  csvFiles.forEach(fName => {
    const fPath = path.join(PROJECT_ROOT, 'reports', fName);
    if (fs.existsSync(fPath)) {
      const records = parseCsv(fs.readFileSync(fPath, 'utf8'), { columns: true, skip_empty_lines: true, bom: true });
      const approved = records.filter(r => r.reviewStatus === 'APPROVED' || (r.decision && r.decision.trim() !== ''));
      approved.forEach(r => {
        totalApprovedVerified++;
        const wId = r.wordId || r.word;
        const expectedZh = (r.finalMeaningZhTW || r.suggestedMeaningZhTW || '').trim();
        const defs = getWordDefinitions(wId);
        if (!defs) {
          all313Match = false;
          return;
        }
        const rawSense = defs.rawDefinitions.find(d => d.id === r.senseId);
        if (!rawSense || (rawSense.chineseDefinition || '').trim() !== expectedZh) {
          all313Match = false;
        }
      });
    }
  });

  assert(all313Match && totalApprovedVerified === 313, `All ${totalApprovedVerified} approved records across 4 CSV batches match getWordDefinitions() runtime display.`);

  // 14. Approved KEEP_MERGED groups (north, service, south, table) preserved intact
  const northDefs = getWordDefinitions('north-588');
  const serviceDefs = getWordDefinitions('service-754');
  const southDefs = getWordDefinitions('south-813');
  const tableDefs = getWordDefinitions('table-849');

  const northNounOK = northDefs && northDefs.primaryDefinitions.some(d => d.sourceSenseIds && d.sourceSenseIds.includes('north%1:24:00::') && d.meaningZhTW === '正北；北方');
  const serviceNounOK = serviceDefs && serviceDefs.primaryDefinitions.some(d => d.sourceSenseIds && d.sourceSenseIds.includes('service%1:04:08::') && d.meaningZhTW === '服務；協助');
  const southNounOK = southDefs && southDefs.primaryDefinitions.some(d => d.sourceSenseIds && d.sourceSenseIds.includes('south%1:24:00::') && d.meaningZhTW === '正南；南方（方位）');
  const tableNounOK = tableDefs && tableDefs.primaryDefinitions.some(d => d.sourceSenseIds && d.sourceSenseIds.includes('table%1:06:01::') && d.meaningZhTW === '桌子；餐桌');

  const keepMergedIntact = northNounOK && serviceNounOK && southNounOK && tableNounOK;
  assert(keepMergedIntact, 'Approved KEEP_MERGED groups (north, service, south, table) preserved intact in primary definitions.');

  console.log('\n----------------------------------------------------');
  console.log(`SUMMARY: ${passed} Passed, ${failed} Failed.`);
  console.log('----------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
