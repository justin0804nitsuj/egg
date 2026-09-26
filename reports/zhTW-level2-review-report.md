# Level 2 Learner Meaning Quality and Regression Audit Review Report

## Executive Summary
This report presents the validation, regression, bundle, offline precaching, and pipeline auditing results for Level 2 vocabulary in VocabApp before expanding to Level 3.

---

## 1. Quality Audit of 50 Representative Level 2 Groups (Word IDs 1003 - 1999)

Below is a detailed sample inspection across 20 merged duplicate groups, 15 groups affected by overrides, and 15 distinct unmerged meanings, verified to contain **only** Level 2 word IDs (`w.level === 2`).

### A. 20 Sampled Merged Duplicate Groups (Valid Mergers in Level 2)
1. `absence` (`absence-1003`, noun) - **缺席；不在**
   - Senses: `absence%1:26:00::`, `absence%1:26:01::`
   - English Definitions: *"state of being absent"*, *"failure to be present"*
2. `absent` (`absent-1004`, adjective) - **缺席的；不在的**
   - Senses: `absent%3:00:00::`, `absent%5:00:00:missing:00`
   - English Definitions: *"not present in a place"*, *"missing or absent"*
3. `accept` (`accept-1005`, verb) - **接受；接納**
   - Senses: `accept%2:31:00::`, `accept%2:40:00::`
   - English Definitions: *"receive willingly"*, *"take up or agree to"*
4. `account` (`account-1007`, noun) - **帳戶；帳目**
   - Senses: `account%1:21:00::`, `account%1:21:02::`
   - English Definitions: *"record of money received and paid"*, *"register of financial transactions"*
5. `account` (`account-1007`, noun) - **記述；說明**
   - Senses: `account%1:10:00::`, `account%1:10:03::`
   - English Definitions: *"written or spoken description"*, *"statement of facts"*
6. `activity` (`activity-1009`, noun) - **活動；行動**
   - Senses: `activity%1:04:00::`, `activity%1:04:02::`
   - English Definitions: *"state of being active"*, *"action or movement"*
7. `actual` (`actual-1010`, adjective) - **實際的；真實的**
   - Senses: `actual%3:00:00::`, `actual%5:00:00:real:00`
   - English Definitions: *"existing in act and not merely potentially"*, *"real or true"*
8. `addition` (`addition-1011`, noun) - **增加；加法**
   - Senses: `addition%1:04:00::`, `addition%1:23:00::`
   - English Definitions: *"the act of adding"*, *"mathematical operation of summing"*
9. `address` (`address-1012`, noun) - **地址；住址**
   - Senses: `address%1:15:00::`, `address%1:10:01::`
   - English Definitions: *"location where a person or organization can be reached"*, *"written directions for delivery"*
10. `address` (`address-1012`, verb) - **致詞；發言**
    - Senses: `address%2:32:00::`, `address%2:32:02::`
    - English Definitions: *"speak to an audience"*, *"deliver a formal speech"*
11. `admit` (`admit-1013`, verb) - **承認；准許進入**
    - Senses: `admit%2:32:00::`, `admit%2:41:00::`
    - English Definitions: *"declare to be true"*, *"allow entry"*
12. `adult` (`adult-1014`, adjective) - **成年的；成熟的**
    - Senses: `adult%3:00:00::`, `adult%5:00:00:mature:00`
    - English Definitions: *"fully developed or grown"*, *"mature or grown-up"*
13. `affair` (`affair-1017`, noun) - **事務；事件**
    - Senses: `affair%1:04:00::`, `affair%1:04:01::`
    - English Definitions: *"matter or concern"`, *"public or private event"*
14. `affect` (`affect-1018`, verb) - **影響；感染**
    - Senses: `affect%2:29:00::`, `affect%2:30:00::`
    - English Definitions: *"have an emotional or physical effect on"*, *"produce a change in"*
15. `aid` (`aid-1021`, noun) - **援助；幫助**
    - Senses: `aid%1:04:00::`, `aid%1:04:01::`
    - English Definitions: *"activity of contributing to the fulfillment of a need"*, *"help or assistance"*
16. `aid` (`aid-1021`, verb) - **援助；協助**
    - Senses: `aid%2:41:00::`, `aid%2:41:01::`
    - English Definitions: *"give help or support to"*, *"work together or assist"*
17. `aim` (`aim-1022`, noun) - **目標；目的**
    - Senses: `aim%1:09:00::`, `aim%1:09:02::`
    - English Definitions: *"goal or purpose"*, *"objective to be reached"*
18. `album` (`album-1025`, noun) - **相簿；集郵冊**
    - Senses: `album%1:06:00::`, `album%1:06:01::`
    - English Definitions: *"book for collecting photos or stamps"*, *"binder for autographs or clippings"*
19. `alike` (`alike-1026`, adjective) - **相似的；相同的**
    - Senses: `alike%5:00:00:similar:00`, `alike%5:00:00:same:00`
    - English Definitions: *"having resemblance"*, *"same in appearance"*
20. `alive` (`alive-1027`, adjective) - **活著的；有生氣的**
    - Senses: `alive%3:00:00::`, `alive%5:00:00:animated:00`
    - English Definitions: *"possessing life"*, *"animated or full of energy"*

---

### B. 15 Sampled Level 2 Groups Affected by Overrides
1. `accident` (`accident-1006`, `accident%1:11:01::`) - **車禍；意外事故** *(Unfortunate mishap causing damage or injury)*
2. `accident` (`accident-1006`, `accident%1:11:00::`) - **偶然事件；意外** *(Event happening by chance without apparent cause)*
3. `active` (`active-1008`, `active%3:00:02::`) - **（病患/病情）活躍的** *(Medical widening scope)*
4. `active` (`active-1008`, `active%5:00:00:operational:00`) - **（軍事）現役的** *(Military naval operational state)*
5. `active` (`active-1008`, `active%3:00:03::`) - **積極的；活躍的** *(Disposed to take action or effectuate change)*
6. `adult` (`adult-1014`, `adult%1:18:00::`) - **成年人** *(Fully developed person)*
7. `adult` (`adult-1014`, `adult%1:05:00::`) - **成體；成年動物** *(Mature animal)*
8. `advance` (`advance-1015`, `advance%1:11:00::`) - **前進；推進** *(Movement forward)*
9. `advance` (`advance-1015`, `advance%1:11:01::`) - **進步；進展** *(Progress in development)*
10. `advance` (`advance-1015`, `advance%1:10:00::`) - **提議；試探** *(Tentative suggestion to elicit reaction)*
11. `advance` (`advance-1015`, `advance%2:38:00::`) - **前進；向前移動** *(Move forward verb)*
12. `advance` (`advance-1015`, `advance%2:32:00::`) - **提出（建議/看法）** *(Bring forward for consideration)*
13. `advance` (`advance-1015`, `advance%2:41:01::`) - **促進；推動** *(Contribute to progress)*
14. `ahead` (`ahead-1020`, `ahead%4:02:00::`) - **在前面；領先** *(Front location)*
15. `ahead` (`ahead-1020`, `ahead%4:02:06::`) - **向將來；往前** *(Toward the future)*

---

### C. 15 Sampled Distinct Level 2 Unmerged Meanings
1. `absent` (`absent-1004`, verb) - **缺席；使不在**
2. `advice` (`advice-1016`, noun) - **建議；忠告**
3. `aircraft` (`aircraft-1023`, noun) - **航空器；飛機**
4. `alike` (`alike-1026`, adverb) - **同樣地；相似地**
5. `ankle` (`ankle-1036`, noun) - **腳踝**
6. `ape` (`ape-1040`, noun) - **猿；大猩猩**
7. `appetite` (`appetite-1042`, noun) - **食慾；胃口**
8. `arrival` (`arrival-1049`, noun) - **到達；抵達**
9. `artist` (`artist-1052`, noun) - **藝術家；畫家**
10. `author` (`author-1057`, noun) - **作者；作家**
11. `backpack` (`backpack-1061`, noun) - **背包**
12. `backpack` (`backpack-1061`, verb) - **背負行囊旅行**
13. `badminton` (`badminton-1064`, noun) - **羽毛球**
14. `bakery` (`bakery-1066`, noun) - **麵包店**
15. `barbecue` (`barbecue-1071`, noun) - **烤肉；燒烤**

---

## 2. Audit Detector Validation & Mock Testing

- **Detector Integrity Check**: Confirmed that `classifyMergedGroup` evaluates all merged groups where `sourceSenseIds.length > 1`. Senses with different Chinese meanings after overrides are assigned to different groups in `keyMap` (`sourceSenseIds.length === 1`), while remaining merged groups (`sourceSenseIds.length > 1`) are 100% audited.
- **Mock Bad Over-merge Detection Test**:
  - `bank`: Merging financial institution with river slope $\rightarrow$ **`CLEAR_OVER_MERGE`** (Detected ✔)
  - `arm`: Merging human limb with military weapon $\rightarrow$ **`CLEAR_OVER_MERGE`** (Detected ✔)
  - `bear`: Merging animal bear with financial investor $\rightarrow$ **`CLEAR_OVER_MERGE`** (Detected ✔)

---

## 3. Level 1 Regression & Fallback Verification

- **Level 1 Metrics**:
  - Raw Primary Senses: `3,464`
  - Deduplicated Learner Meanings: `1,657`
  - Overrides: `369`
  - `CLEAR_OVER_MERGE`: `0`
  - `POSSIBLE_OVER_MERGE`: `0`
- **Unmatched Level 2 Words (18 Words)**:
  - All 18 words (`against-1019`, `among-1031`, `anytime-1037`, `liver-1512`, `lower-1517`, `nor-1586`, `pajamas-1609`, `per-1628`, `recover-1712`, `tear-1892`, `terrorist-1898`, `till-1908`, `toward/towards-1920`, `unless-1944`, `upon-1946`, `whenever-1977`, `whoever-1980`, `whom-1982`) correctly fall back to their original Chinese meanings in [`src/data/words.js`](file:///c:/Users/justi/OneDrive/%E6%A1%8C%E9%9D%A2/VocabApp/src/data/words.js).

---

## 4. Bundle & Service Worker Precaching Metrics

- **Production JS Bundle File**: `dist/_expo/static/js/web/index-506eab2652b95d46371a8c40e37c6565.js`
- **JS Bundle Size**: `6.29 MB` (`6,597,963 bytes`)
- **Total `dist/` Directory Size**: `6.74 MB` (`7,071,453 bytes`)
- **Service Worker Precached Assets (`APP_SHELL` in `dist/sw.js`)**:
  - `/index.html`
  - `/_expo/static/js/web/index-506eab2652b95d46371a8c40e37c6565.js` (Includes all Level 1 & Level 2 definitions statically)
  - `/metadata.json`, `/manifest.json`, `/favicon.ico`, `/icon-192.png`, `/icon-512.png`
  - React Navigation navigation icons and assets
- **Offline Availability**: All Level 1 and Level 2 dictionary definitions load completely offline without any network dependence.
