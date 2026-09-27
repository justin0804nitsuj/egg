const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const approvedCsvPath = path.join(projectRoot, 'reports', 'zhTW-level1-batch2-approved.csv');
const buildOverridesPath = path.join(projectRoot, 'scripts', 'buildOverridesAndVerify.cjs');

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

const csvRaw = fs.readFileSync(approvedCsvPath, 'utf8');
const approvedRows = parseCSV(csvRaw).filter(r => r.reviewStatus === 'APPROVED');

console.log(`Approved rows to import: ${approvedRows.length}`);

// Generate code string for the new entries
const newEntriesCode = approvedRows.map(row => {
  const { senseId, finalMeaningZhTW, decision, reviewerNotes } = row;
  const reasonStr = `User-reviewed batch2 (${decision}): ${reviewerNotes || 'Approved in CSV review'}`.replace(/"/g, '\\"');
  const meaningStr = finalMeaningZhTW.replace(/"/g, '\\"');
  return `  "${senseId}": {\n    "meaningZhTW": "${meaningStr}",\n    "reason": "${reasonStr}"\n  }`;
}).join(',\n');

// Read existing buildOverridesAndVerify.cjs
const buildOverridesContent = fs.readFileSync(buildOverridesPath, 'utf8');

// Find insertion point: right before "  2: {" which marks the end of LEVEL_MANUAL_OVERRIDES[1]
const targetInsertionMarker = '  2: {';
const targetPos = buildOverridesContent.indexOf(targetInsertionMarker);

if (targetPos === -1) {
  console.error('Could not find target insertion marker "  2: {" in buildOverridesAndVerify.cjs');
  process.exit(1);
}

// Find the closing brace of LEVEL_MANUAL_OVERRIDES[1] right before targetPos
const beforeTarget = buildOverridesContent.slice(0, targetPos);
const lastClosingBracePos = beforeTarget.lastIndexOf('}');

if (lastClosingBracePos === -1) {
  console.error('Could not find closing brace "}" before "  2: {"');
  process.exit(1);
}

// Insert new entries: add comma to previous entry if needed, then new entries, then closing brace
const beforeBrace = buildOverridesContent.slice(0, lastClosingBracePos);
const afterBrace = buildOverridesContent.slice(lastClosingBracePos);

const updatedContent = beforeBrace + ',\n' + newEntriesCode + '\n' + afterBrace;

fs.writeFileSync(buildOverridesPath, updatedContent, 'utf8');
console.log('Successfully updated scripts/buildOverridesAndVerify.cjs with 90 Batch 2 approved overrides!');
