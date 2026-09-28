# VocabApp Level 1–6 繁體中文字典品質審核報告 (Final Semantic Audit Report)

**產生時間**: 2026-09-28T12:07:58.452Z  
**專案分支**: `feature/dictionary-completion`  
**涵蓋範疇**: Level 1–6 全部 6,012 個單字（8,425 個學習詞義）  
**語言規範**: 台灣繁體中文 (Traditional Chinese - Taiwan `zh-TW`)  

---

## 一、 執行結果摘要

| 項目 | 數量 / 狀態 | 說明 |
| :--- | :--- | :--- |
| **總學習單字數** | 6,012 個 | Level 1–6 每級 1,002 單字 |
| **總學習詞義數** | 8,425 個 | 經去重後之正式學習詞義 |
| **單字中文涵蓋率** | 100.0% (0 遺漏) | 所有 6,012 單字均具備可用繁體中文定義 |
| **人工作核核准紀錄** | 529 筆 Verified | 498 筆 Level 1 + 31 筆 Level 2 手動核准項目 |
| **候選詞義區隔** | 1,374 筆 auto_differentiated | 保持 `status: 'auto_differentiated'` 待審，不污染預設顯示 |
| **詞性錯配修復 (POS Mismatch)** | 60 筆 (28 單字) | 修正動詞詞義被錯誤指派純名詞定義之問題 |
| **待審群組總數** | 491 個群組 | 映射 1,374 筆候選區隔詞義 |
| **三層品質分類** | SAFE: 0 / REC: 447 / AMB: 44 | 44 筆具備潛在隱喻或複雜學術定義優先待審 |
| ** Level 1 原有資料** | 100% 凍結保護 | 313 筆審核紀錄與 498 筆 Verified Overrides 完全不受影響 |

---

## 二、 詞性錯配 (POS Mismatch) 專案核查報告

針對語義審核報告中指出之 POS Mismatch 進行全面排查：

1. **`bear` 單字專案核實結果**：
   - **問題原委**：原 Level 1 字典基線中，`bear` 的動詞 Sense (`bear%2:42:01::`, `bear%2:37:01::`, `bear%2:29:01::`) 因預設備用機制被填入名詞原義「熊」。而在審核報告生成時，腳本又建議將「忍受；承受」標記於名詞與動詞混合之項目，造成詞性混淆。
   - **實質修復**：
     - 名詞 `bear%1:05:00::` (massive mammal) 保持：「**熊**」
     - 名詞 `bear%1:18:00::` (investor) 保持：「**空頭；看跌者**」
     - 動詞 `bear%2:42:01::` (have/support) 修正為：「**具有；承擔**」
     - 動詞 `bear%2:37:01::` (maintain thoughts) 修正為：「**抱有；懷有**」
     - 動詞 `bear%2:29:01::` (cause to be born) 修正為：「**生育；產下**」
     - 動詞 `bear%2:31:00::` (put up with) 修正為：「**忍受；承受**」

2. **全字典 POS 掃描與修復結果**：
   - 掃描全 Level 1–6 共 14,000+ WordNet 詞義項，確認 **0 筆** WordNet 詞性 Key (`%1:`, `%2:`, `%3:`, `%4:`) 與 `partOfSpeechLabel` 錯配。
   - 發現 60 筆動詞 Sense 被指派純名詞翻譯之資料缺陷（共 28 個單字），已全面完成修復：
     - Level 1 (47 筆)：`bear`, `bridge`, `dream`, `fire`, `fish`, `flower`, `foot`, `hand`, `head`, `oil`, `paper`, `park`, `people`, `rain`, `salt`, `school`, `ship`, `shop`, `star`, `store`, `water`
     - Level 2 (4 筆)：`firm`, `iron`, `sand`
     - Level 3 (6 筆)：`harbor`, `peel`
     - Level 4 (3 筆)：`bloom`, `blossom`

---

## 三、 529 筆 Verified Overrides 來源稽核對照

| 資料層級 | Verified Overrides 數量 | 證明與來源依據 |
| :--- | :--- | :--- |
| **Level 1** | **498 筆** | 包含 313 筆 4 批次人工核准 CSV 審核紀錄 (Batch 1: 83, Batch 2: 90, Batch 3: 87, Final: 53) 衍生之 494 筆 Sense Overrides + 4 筆基線核准 KEEP_MERGED 群組 (`north`, `service`, `south`, `table`) |
| **Level 2** | **31 筆** | 經過人工比對確認之手動 Verified Sense Overrides |
| **Level 3–6** | **0 筆** | 嚴格執行紀律，無人工核准證據者 **零標記** 為 `verified` |
| **合計** | **529 筆** | 完全具備可追溯之核准證據 |

---

## 四、 491 個待審群組三層品質分類與語義分析

依據可重現規則對 Level 2–6 全部 491 個待審群組（映射 1,374 筆 `auto_differentiated` 候選詞義）進行分類：

1. **`SAFE_AUTO_FIX` (0 筆)**：
   - 格式修正與純文字去重。實質語義或翻譯調整均保留於待審佇列，未擅自標記為人工核准。

2. **`RECOMMENDED_REVIEW` (447 筆)**：
   - 具備清晰領域或用法差異（如植物、專業領域、體育或動物分類），已產生精準、適合高中生之帶領域標籤中文定義（如 `corn` -> 玉蜀黍（植物） | 玉米粒（穀物） | 玉米穗（食材））。

3. **`AMBIGUOUS_REVIEW` (44 筆)**：
   - 英文定義複雜、具備深層比喻或學術抽象概念，建議優先由人工評估：
     - Level 2 (9 筆)：`brain`, `complex`, `corn`, `earthquake`, `gold`, `hop`, `silver`, `spider`, `worm`
     - Level 3 (9 筆)：`civil`, `mall`, `peanut`, `pitch`, `plastic`, `process`, `program`, `record`, `tissue`
     - Level 4 (11 筆)：`bond`, `charge`, `drift`, `film`, `firm`, `form`, `fund`, `index`, `instrument`, `interest`, `issue`
     - Level 5 (10 筆)：`cabinet`, `cell`, `character`, `commission`, `draft`, `party`, `resolution`, `scale`, `section`, `state`
     - Level 6 (5 筆)：`capital`, `colony`, `deck`, `faculty`, `strain`

---

## 五、 自動化驗證與程式品質檢查

1. **Regression Test Suite (`npm run test:regression`)**:
   - **16 / 16 PASSED (0 Failed)**
   - 驗證 `auto_differentiated` 不影響預設運行顯示。
   - 驗證 `verified` override 正確覆蓋。
   - 驗證 313 筆審核紀錄與 Level 1 歷史資料 100% 吻合。
   - 驗證字典生成器具備 idempotency（重構執行輸出 byte-for-byte 相同）。

2. **Expo Linter (`npx expo lint`)**:
   - **0 Error / 0 Warning** (Clean pass).

3. **Production Web Build (`npm run build:web`)**:
   - `dist/` Bundle 及 `sw.js` Service Worker 順利建置完成。

---

## 六、 結論與 Git 提交準備

- 本次品質審核完全符合指令要求，所有數據精確、可追溯且具備嚴格的隔離與保護機制。
- Level 1 歷史資料與 Verified Overrides 100% 保持凍結。
- 分支 `feature/dictionary-completion` 已準備進行獨立 Git Commit。
- **未執行 Merge、Push 或 Deploy**。
