# Level 1 Traditional Chinese Learner-Meaning Deduplication Audit Report

This report presents a thorough linguistic audit of all **991** merged duplicate sense groups in Level 1 vocabulary.

---

## 1. Summary Statistics

| Metric | Count | Percentage |
| :--- | :---: | :---: |
| **Total Merged Groups Audited** | **991** | 100% |
| **SAFE_DUPLICATE** (Valid mergers) | **987** | 99.6% |
| **POSSIBLE_OVER_MERGE** (Nuanced / distinct usage) | **0** | 0.0% |
| **CLEAR_OVER_MERGE** (Must be separated) | **4** | 0.4% |
| **Total Affected Words** | **764** | - |

---

## 2. Top Words Needing Review

These words contain questionable mergers where distinct concepts were collapsed under identical Chinese translations:

1. **north** (1 questionable group)
2. **service** (1 questionable group)
3. **south** (1 questionable group)
4. **table** (1 questionable group)

---

## 3. Questionable Over-Merge Examples & Audit Detail

### 1. `north` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `正北；北方`
- **Source Sense IDs**: `north%1:24:00::`, `north%1:24:02::`
- **English Definitions**:
  1. *"the cardinal compass point that is at 0 or 360 degrees"*
  2. *"the direction corresponding to the northward cardinal compass point"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, transport, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `正北；北方 (義項 1)` | `正北；北方 (義項 2)`

---

### 2. `service` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `服務；協助`
- **Source Sense IDs**: `service%1:04:08::`, `service%1:04:00::`
- **English Definitions**:
  1. *"work done by one person or group that benefits another"*
  2. *"an act of help or assistance; something (such as a tool, software or system) used to render said help or assistance"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `服務；協助 (義項 1)` | `服務；協助 (義項 2)`

---

### 3. `south` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `正南；南方（方位）`
- **Source Sense IDs**: `south%1:24:00::`, `south%1:24:02::`
- **English Definitions**:
  1. *"the cardinal compass point that is at 180 degrees"*
  2. *"the direction corresponding to the southward cardinal compass point"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, transport, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `正南；南方（方位） (義項 1)` | `正南；南方（方位） (義項 2)`

---

### 4. `table` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `桌子；餐桌`
- **Source Sense IDs**: `table%1:06:01::`, `table%1:06:02::`
- **English Definitions**:
  1. *"a piece of furniture having a smooth flat top that is usually supported by one or more vertical legs"*
  2. *"a piece of furniture with tableware for a meal laid out on it"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `桌子；餐桌 (義項 1)` | `桌子；餐桌 (義項 2)`

