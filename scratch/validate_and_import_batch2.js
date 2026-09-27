const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const approvedCsvPath = path.join(projectRoot, 'reports', 'zhTW-level1-batch2-approved.csv');
const buildOverridesPath = path.join(projectRoot, 'scripts', 'buildOverridesAndVerify.cjs');
const wordDefsPath = path.join(projectRoot, 'src', 'data', 'wordDefinitions.js');

// Simple CSV Parser handling quotes and BOM
function parseCSV(text) {
  const cleanText = text.replace(/^\uFEFF/, '');
  const lines = [];
  let curLine = [];
  let curToken = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const ch = cleanText[i];
    const nextCh = cleanText[i + 1];

    if (ch === '"') {
      if (inQuotes && nextCh === '"') {
        curToken += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      curLine.push(curToken);
      curToken = '';
    } else if ((ch === '\r' || ch === '\n') && !inQuotes) {
      if (ch === '\r' && nextCh === '\n') {
        i++;
      }
      curLine.push(curToken);
      curToken = '';
      if (curLine.some(cell => cell.trim() !== '')) {
        lines.push(curLine);
      }
      curLine = [];
    } else {
      curToken += ch;
    }
  }
  if (curToken || curLine.length > 0) {
    curLine.push(curToken);
    if (curLine.some(cell => cell.trim() !== '')) {
      lines.push(curLine);
    }
  }

  if (lines.length === 0) return [];
  const header = lines[0].map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const row = {};
    header.forEach((h, idx) => {
      row[h] = lines[i][idx] ? lines[i][idx].trim() : '';
    });
    rows.push(row);
  }
  return rows;
}

// Read CSV
const csvRaw = fs.readFileSync(approvedCsvPath, 'utf8');
const allRows = parseCSV(csvRaw);

console.log(`Total CSV rows read: ${allRows.length}`);

const approvedRows = allRows.filter(r => r.reviewStatus === 'APPROVED');
const unapprovedRows = allRows.filter(r => r.reviewStatus !== 'APPROVED');

console.log(`Approved rows: ${approvedRows.length}`);
console.log(`Unapproved/NEEDS_REVIEW rows: ${unapprovedRows.length}`);

// Load valid sense IDs from wordDefinitions.js
const { WORD_DEFINITIONS_BY_ID } = require(wordDefsPath);
const validSenseIds = new Set();
const wordSenseIdMap = new Map();

for (const [wId, entry] of Object.entries(WORD_DEFINITIONS_BY_ID)) {
  const pList = entry.p || [];
  const sList = entry.s || [];
  [...pList, ...sList].forEach(item => {
    const senseId = item[0];
    validSenseIds.add(senseId);
    wordSenseIdMap.set(senseId, wId);
  });
}

console.log(`Total valid WordNet sense IDs: ${validSenseIds.size}`);

// Read existing buildOverridesAndVerify.cjs LEVEL_MANUAL_OVERRIDES[1]
const buildOverridesContent = fs.readFileSync(buildOverridesPath, 'utf8');
const l1Start = buildOverridesContent.indexOf('1: {');
const l2Start = buildOverridesContent.indexOf('2: {');
const l1Block = buildOverridesContent.substring(l1Start, l2Start);
const lastBrace = l1Block.lastIndexOf('}');
const objCode = l1Block.substring(l1Block.indexOf('{'), lastBrace + 1);

let existingL1Overrides = {};
try {
  existingL1Overrides = eval('(' + objCode + ')');
} catch (e) {
  console.error('Error evaluating existing L1 overrides:', e);
  process.exit(1);
}

console.log(`Existing verified override keys in LEVEL_MANUAL_OVERRIDES[1]: ${Object.keys(existingL1Overrides).length}`);

// Validation checks
const errors = [];
const conflicts = [];
const senseIdMapInCSV = new Map();
const exactDuplicates = [];
const conflictingDuplicates = [];
const newOverrides = [];
const updatedOverrides = [];
const unchangedOverrides = [];

approvedRows.forEach((row, idx) => {
  const lineNum = idx + 2;
  const { senseId, wordId, word, partOfSpeech, finalMeaningZhTW, decision, reviewerNotes } = row;

  // 1. Check valid senseId in WordNet
  if (!senseId || !validSenseIds.has(senseId)) {
    errors.push(`Row ${lineNum}: Invalid or unknown senseId '${senseId}' for word '${word}'`);
  }

  // 2. Check wordId matches
  if (wordId && wordSenseIdMap.has(senseId)) {
    const expectedWordId = wordSenseIdMap.get(senseId);
    if (expectedWordId !== wordId) {
      errors.push(`Row ${lineNum}: Mismatched wordId '${wordId}' for senseId '${senseId}' (Expected '${expectedWordId}')`);
    }
  }

  // 3. Check finalMeaningZhTW non-empty
  if (!finalMeaningZhTW) {
    errors.push(`Row ${lineNum}: finalMeaningZhTW is empty for senseId '${senseId}'`);
  }

  // 4. Check decision valid
  if (!['APPROVE', 'REVISE', 'KEEP_MERGED'].includes(decision)) {
    errors.push(`Row ${lineNum}: Invalid decision '${decision}' for senseId '${senseId}'`);
  }

  // 5. Check duplicate sense IDs in CSV
  if (senseIdMapInCSV.has(senseId)) {
    const prev = senseIdMapInCSV.get(senseId);
    if (prev.finalMeaningZhTW === finalMeaningZhTW && prev.decision === decision) {
      exactDuplicates.push({ senseId, prev, current: row });
    } else {
      conflictingDuplicates.push({ senseId, prev, current: row });
      errors.push(`Row ${lineNum}: Conflicting duplicate entry for senseId '${senseId}' (Prev: '${prev.finalMeaningZhTW}', Cur: '${finalMeaningZhTW}')`);
    }
  } else {
    senseIdMapInCSV.set(senseId, row);
  }

  // 6. Check existing verified override status
  if (existingL1Overrides[senseId]) {
    const existing = existingL1Overrides[senseId];
    if (existing.meaningZhTW !== finalMeaningZhTW) {
      conflicts.push({
        senseId,
        word,
        existingMeaning: existing.meaningZhTW,
        newMeaning: finalMeaningZhTW,
        existingReason: existing.reason,
        decision
      });
      updatedOverrides.push({ senseId, word, oldMeaning: existing.meaningZhTW, newMeaning: finalMeaningZhTW });
    } else {
      unchangedOverrides.push({ senseId, word, meaning: finalMeaningZhTW });
    }
  } else {
    newOverrides.push({ senseId, word, meaning: finalMeaningZhTW, decision, reviewerNotes });
  }
});

console.log('\n========================================');
console.log('            VALIDATION REPORT           ');
console.log('========================================');
console.log(`Validation Errors count: ${errors.length}`);
if (errors.length > 0) {
  errors.forEach(e => console.error('  ERROR:', e));
}

console.log(`Exact duplicate rows in CSV: ${exactDuplicates.length}`);
console.log(`Conflicting duplicate rows in CSV: ${conflictingDuplicates.length}`);

console.log(`Conflicts with existing verified overrides count: ${conflicts.length}`);
if (conflicts.length > 0) {
  conflicts.forEach(c => {
    console.log(`  CONFLICT: senseId ${c.senseId} (${c.word}): Existing='${c.existingMeaning}' vs Approved New='${c.newMeaning}' (Reason: '${c.existingReason}')`);
  });
}

console.log(`\nImport Summary Breakdown:`);
console.log(`- Approved rows to process: ${approvedRows.length}`);
console.log(`- New override keys to add: ${newOverrides.length}`);
console.log(`- Existing override keys to update: ${updatedOverrides.length}`);
console.log(`- Existing override keys already matching: ${unchangedOverrides.length}`);
