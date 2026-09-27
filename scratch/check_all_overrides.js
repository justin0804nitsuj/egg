const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const approvedCsvPath = path.join(projectRoot, 'reports', 'zhTW-level1-batch2-approved.csv');
const buildOverridesPath = path.join(projectRoot, 'scripts', 'buildOverridesAndVerify.cjs');
const overridesJsPath = path.join(projectRoot, 'src', 'data', 'wordDefinitionsZhTW_L1_overrides.js');

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

// 1. Read existing 268 overrides from src/data/wordDefinitionsZhTW_L1_overrides.js
const overridesJsContent = fs.readFileSync(overridesJsPath, 'utf8');
const jsObjCode = overridesJsContent.substring(overridesJsContent.indexOf('{'), overridesJsContent.lastIndexOf('}') + 1);
const existing268Map = eval('(' + jsObjCode + ')');

console.log('Existing 268 verified overrides in wordDefinitionsZhTW_L1_overrides.js:', Object.keys(existing268Map).length);

// 2. Read Batch 2 approved rows
const batch2ApprovedRows = parseCSV(fs.readFileSync(approvedCsvPath, 'utf8')).filter(r => r.reviewStatus === 'APPROVED');
console.log('Batch 2 approved rows count:', batch2ApprovedRows.length);

// 3. Check overlap / conflicts with 268 existing entries
const overlap = [];
const conflicts = [];

batch2ApprovedRows.forEach(row => {
  const { senseId, finalMeaningZhTW, word } = row;
  if (existing268Map[senseId]) {
    const existing = existing268Map[senseId];
    overlap.push(senseId);
    if (existing.meaningZhTW !== finalMeaningZhTW) {
      conflicts.push({ senseId, word, existingMeaning: existing.meaningZhTW, newMeaning: finalMeaningZhTW, reason: existing.reason });
    }
  }
});

console.log(`Overlap count: ${overlap.length}`);
console.log(`Conflict count with existing 268 overrides: ${conflicts.length}`);
if (conflicts.length > 0) {
  conflicts.forEach(c => {
    console.log(`  CONFLICT: ${c.senseId} (${c.word}): Existing='${c.existingMeaning}' vs Approved New='${c.newMeaning}' (Reason: '${c.reason}')`);
  });
}
