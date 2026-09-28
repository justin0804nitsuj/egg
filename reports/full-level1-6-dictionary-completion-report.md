# VocabApp 全 Level (1–6) 繁體中文字典最終品質核對與驗證報告

---

## 1. 數據核對與 Overrides 來源稽核 (Data Reconciliation & Provenance Audit)

### A. 待審資料列數精確核對 (Review Queue CSV Row Reconciliation)
- **先前報告 592 筆之原因**：早期統計包含未清理之舊版 Level 1 批次 CSV 換行符號與文字檔總行數。
- **精確核對結果**：全 Level 1–6 Review Queue CSV 實體資料列數精確加總為 **495 筆**（L1: 4, L2: 133, L3: 101, L4: 91, L5: 101, L6: 65）。
- **對齊說明**：L1 的 4 筆為使用者已核准之 KEEP_MERGED 組（north, service, south, table）；L2–L6 491 筆為 CLEAR_OVER_MERGE / POSSIBLE_OVER_MERGE 之多義項待審組。

### B. Overrides 來源與 Status 嚴格區分 (Overrides Status Discipline)
- **Human Verified Overrides (人核准已驗證)**：**529 筆**（包含 Level 1 四批次審核之 498 筆 Verified Overrides 與 Level 2 之 31 筆手動 Overrides）。 status 均標記為 verified。
- **Auto-Differentiated Candidate Overrides (自動切分候選項)**：**1374 筆**。 status 均標記為 auto_differentiated，進入 Review Queue 為 NEEDS_REVIEW，**絕不安插假驗證**，亦不干擾預設 Learner 運行顯示。

---

## 2. 全局統計摘要 (Global Summary Statistics)

| 指標 (Metric) | 數值 (Count) | 說明 (Description) |
| :--- | :---: | :--- |
| **全六級單字總數** | **6012** | Level 1–6 各 1,002 字（100% 完全收錄） |
| **Learner 學習詞義總數** | **8250** | 去重後呈現給使用者的核心學習義項 |
| **Human Verified Overrides** | **529** | 人工核准之 Verified Overrides（498 筆 L1 + 31 筆 L2） |
| **Auto-Differentiated Candidate Overrides** | **1374** | 自動語意區隔候選項 (標記為 auto_differentiated) |
| **CLEAR_OVER_MERGE** | **486** | 經演算法與語意域衝突偵測之過度合併組 |
| **POSSIBLE_OVER_MERGE** | **9** | 細微詞義分立組 |
| **SAFE_DUPLICATE** | **5366** | 安全去重併合組 |
| **Review Queue 總資料列數** | **495** | 實體 CSV 資料列數（495 筆待審/紀錄） |

---

## 3. 各 Level 統計對照表 (Level-by-Level Breakdown)

| Level | 單字數 | Learner 詞義數 | Human Verified Overrides | Auto-Diff Overrides | CLEAR_OVER_MERGE | POSSIBLE_OVER_MERGE | SAFE_DUPLICATE | Review Queue (CSV) | 覆蓋率 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Level 1** | 1002 | 1715 | 498 | 0 | 4 | 0 | 987 | 4 筆 | 100% |
| **Level 2** | 1002 | 1392 | 31 | 383 | 131 | 2 | 971 | 133 筆 | 100% |
| **Level 3** | 1002 | 1313 | 0 | 285 | 99 | 2 | 916 | 101 筆 | 100% |
| **Level 4** | 1002 | 1260 | 0 | 258 | 89 | 2 | 869 | 91 筆 | 100% |
| **Level 5** | 1002 | 1317 | 0 | 276 | 100 | 1 | 850 | 101 筆 | 100% |
| **Level 6** | 1002 | 1253 | 0 | 172 | 63 | 2 | 773 | 65 筆 | 100% |

---

## 4. 隨機抽查 (Random Sampling) 評估
- 對 Level 2–6 之未標記 SAFE_DUPLICATE 群組隨機抽查 250 組單字 (50 組/Level)，經語意域與核心動作交叉檢驗，**未發現漏報之顯著 Over-merge 衝突**，顯示自動偵測器邊界條件極為穩健。

---

## 5. 自動化測試與構建驗證
- **Regression Test Suite (`npm run test:regression`)**: **16 Passed, 0 Failed** (100% 通過)。
- **Code Lint (`npx expo lint`)**: **0 errors, 0 warnings** (100% 通過)。
- **Production Web Build (`npm run build:web`)**: 成功導出 dist/ 與最新 Service Worker (sw.js)。
