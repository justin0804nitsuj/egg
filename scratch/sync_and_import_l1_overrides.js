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

// Build unified L1 manual overrides map
const mergedL1Map = {};

// Copy existing 268 entries (strip 'status' property since buildOverridesAndVerify adds status: 'verified' automatically)
Object.entries(existing268Map).forEach(([senseId, data]) => {
  mergedL1Map[senseId] = {
    meaningZhTW: data.meaningZhTW,
    reason: data.reason || 'Verified manual override'
  };
});

// Add 90 Batch 2 approved entries
batch2ApprovedRows.forEach(row => {
  const { senseId, finalMeaningZhTW, decision, reviewerNotes } = row;
  const reasonStr = `User-reviewed batch2 (${decision}): ${reviewerNotes || 'Approved in CSV review'}`;
  mergedL1Map[senseId] = {
    meaningZhTW: finalMeaningZhTW,
    reason: reasonStr
  };
});

console.log('Total merged Level 1 manual override keys:', Object.keys(mergedL1Map).length);

// Verify file, close, fan are present in merged map
console.log('Verification of semantic fixes:');
console.log('  file%1:10:00:: ->', mergedL1Map['file%1:10:00::']);
console.log('  close%2:35:00:: ->', mergedL1Map['close%2:35:00::']);
console.log('  fan%2:38:00:: ->', mergedL1Map['fan%2:38:00::']);

// 3. Format JavaScript object literal for buildOverridesAndVerify.cjs
const formattedEntries = Object.entries(mergedL1Map).map(([senseId, data]) => {
  const meaningStr = data.meaningZhTW.replace(/"/g, '\\"');
  const reasonStr = data.reason.replace(/"/g, '\\"');
  return `  "${senseId}": {\n    "meaningZhTW": "${meaningStr}",\n    "reason": "${reasonStr}"\n  }`;
}).join(',\n');

// 4. Update buildOverridesAndVerify.cjs LEVEL_MANUAL_OVERRIDES[1] block
const buildOverridesContent = fs.readFileSync(buildOverridesPath, 'utf8');

const l1StartMarker = '  1: {';
const l2StartMarker = '  2: {';

const l1Pos = buildOverridesContent.indexOf(l1StartMarker);
const l2Pos = buildOverridesContent.indexOf(l2StartMarker, l1Pos);

if (l1Pos === -1 || l2Pos === -1) {
  console.error('Failed to locate LEVEL_MANUAL_OVERRIDES[1] boundaries in buildOverridesAndVerify.cjs');
  process.exit(1);
}

const beforeL1 = buildOverridesContent.slice(0, l1Pos + l1StartMarker.length);
const afterL1 = buildOverridesContent.slice(l2Pos);

// We need a closing `},\n` before `  2: {`
const newL1Content = beforeL1 + '\n' + formattedEntries + '\n  },\n' + afterL1;

fs.writeFileSync(buildOverridesPath, newL1Content, 'utf8');
console.log('Successfully updated scripts/buildOverridesAndVerify.cjs LEVEL_MANUAL_OVERRIDES[1] with 358 total verified overrides!');
