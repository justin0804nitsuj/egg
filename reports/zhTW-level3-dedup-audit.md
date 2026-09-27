# Level 3 Traditional Chinese Learner-Meaning Deduplication Audit Report

This report presents a thorough linguistic audit of all **1017** merged duplicate sense groups in Level 3 vocabulary.

---

## 1. Summary Statistics

| Metric | Count | Percentage |
| :--- | :---: | :---: |
| **Total Merged Groups Audited** | **1017** | 100% |
| **SAFE_DUPLICATE** (Valid mergers) | **916** | 90.1% |
| **POSSIBLE_OVER_MERGE** (Nuanced / distinct usage) | **2** | 0.2% |
| **CLEAR_OVER_MERGE** (Must be separated) | **99** | 9.7% |
| **Total Affected Words** | **823** | - |

---

## 2. Top Words Needing Review

These words contain questionable mergers where distinct concepts were collapsed under identical Chinese translations:

1. **leap** (2 questionable groups)
2. **lick** (2 questionable groups)
3. **pitch** (2 questionable groups)
4. **acceptable** (1 questionable group)
5. **agriculture** (1 questionable group)
6. **alley** (1 questionable group)
7. **armed** (1 questionable group)
8. **attract** (1 questionable group)
9. **awaken** (1 questionable group)
10. **award** (1 questionable group)
11. **baggage** (1 questionable group)
12. **bait** (1 questionable group)
13. **barrel** (1 questionable group)
14. **bomb** (1 questionable group)
15. **bore** (1 questionable group)
16. **bullet** (1 questionable group)
17. **bump** (1 questionable group)
18. **bundle** (1 questionable group)
19. **captain** (1 questionable group)
20. **champion** (1 questionable group)

---

## 3. Questionable Over-Merge Examples & Audit Detail

### 1. `acceptable` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `可接受的`
- **Source Sense IDs**: `acceptable%3:00:00::`, `acceptable%5:00:00:standard:03`, `acceptable%5:00:00:good:01`
- **English Definitions**:
  1. *"worthy of acceptance or satisfactory"*
  2. *"judged to be in conformity with approved usage"*
  3. *"meeting requirements"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, legal). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `可接受的 (義項 1)` | `可接受的 (義項 2)` | `可接受的 (義項 3)`

---

### 2. `agriculture` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `農業`
- **Source Sense IDs**: `agriculture%1:04:01::`, `agriculture%1:04:00::`, `agriculture%1:14:00::`
- **English Definitions**:
  1. *"a large-scale farming enterprise"*
  2. *"the practice of cultivating the land or raising stock"*
  3. *"the class of people engaged in growing food"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, geography, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `農業 (義項 1)` | `農業 (義項 2)` | `農業 (義項 3)`

---

### 3. `alley` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `小路`
- **Source Sense IDs**: `alley%1:06:00::`, `alley%1:06:01::`
- **English Definitions**:
  1. *"a narrow street with walls on both sides"*
  2. *"a lane down which a bowling ball is rolled toward pins"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `小路 (義項 1)` | `小路 (義項 2)`

---

### 4. `armed` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `有扶手的`
- **Source Sense IDs**: `armed%3:00:01::`, `armed%3:00:03::`, `armed%3:00:02::`
- **English Definitions**:
  1. *"(used of persons or the military) characterized by having or bearing arms"*
  2. *"having arms or arms as specified; used especially in combination"*
  3. *"(used of plants and animals) furnished with bristles and thorns"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `有扶手的 (義項 1)` | `有扶手的 (義項 2)` | `有扶手的 (義項 3)`

---

### 5. `attract` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `吸引`
- **Source Sense IDs**: `attract%2:35:00::`, `attract%2:37:00::`, `attract%2:35:01::`
- **English Definitions**:
  1. *"direct toward itself or oneself by means of some psychological power or physical attributes"*
  2. *"be attractive to"*
  3. *"exert a force on (a body) causing it to approach or prevent it from moving away"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `吸引 (義項 1)` | `吸引 (義項 2)` | `吸引 (義項 3)`

---

### 6. `awaken` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `喚醒`
- **Source Sense IDs**: `awaken%2:29:00::`, `awaken%2:29:01::`, `awaken%2:31:00::`
- **English Definitions**:
  1. *"cause to become awake or conscious"*
  2. *"stop sleeping"*
  3. *"make aware"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `喚醒 (義項 1)` | `喚醒 (義項 2)` | `喚醒 (義項 3)`

---

### 7. `award` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `獎品`
- **Source Sense IDs**: `award%2:40:00::`, `award%2:40:01::`
- **English Definitions**:
  1. *"give, especially as an honor or reward"*
  2. *"give as judged due or on the basis of merit"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, legal). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `獎品 (義項 1)` | `獎品 (義項 2)`

---

### 8. `baggage` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `行李`
- **Source Sense IDs**: `baggage%1:06:00::`, `baggage%1:18:00::`, `baggage%1:06:01::`
- **English Definitions**:
  1. *"cases used to carry belongings when traveling"*
  2. *"a worthless or immoral woman"*
  3. *"the portable equipment and supplies of an army"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, transport, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `行李 (義項 1)` | `行李 (義項 2)` | `行李 (義項 3)`

---

### 9. `bait` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `餌`
- **Source Sense IDs**: `bait%2:32:00::`, `bait%2:41:00::`, `bait%2:33:00::`
- **English Definitions**:
  1. *"harass with persistent criticism or carping"*
  2. *"lure, entice, or entrap with bait"*
  3. *"attack with dogs or set dogs upon"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (transport, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `餌 (義項 1)` | `餌 (義項 2)` | `餌 (義項 3)`

---

### 10. `barrel` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `桶`
- **Source Sense IDs**: `barrel%1:06:01::`, `barrel%1:06:00::`, `barrel%1:25:00::`
- **English Definitions**:
  1. *"a tube through which a bullet travels when a gun is fired"*
  2. *"a cylindrical container that holds liquids"*
  3. *"a bulging cylindrical shape; hollow with flat ends"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, container, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `桶 (義項 1)` | `桶 (義項 2)` | `桶 (義項 3)`

---

### 11. `bomb` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `炸彈`
- **Source Sense IDs**: `bomb%2:33:00::`, `bomb%2:41:00::`
- **English Definitions**:
  1. *"throw bombs at or attack with bombs"*
  2. *"fail to get a passing grade"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `炸彈 (義項 1)` | `炸彈 (義項 2)`

---

### 12. `bore` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `令人討厭的人`
- **Source Sense IDs**: `bore%1:18:00::`, `bore%1:11:00::`, `bore%1:07:00::`
- **English Definitions**:
  1. *"a person who evokes boredom"*
  2. *"a high wave (often dangerous) caused by tidal flow (as by colliding tidal currents or in a narrow estuary)"*
  3. *"diameter of a tube or gun barrel"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `令人討厭的人 (義項 1)` | `令人討厭的人 (義項 2)` | `令人討厭的人 (義項 3)`

---

### 13. `bullet` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `子彈`
- **Source Sense IDs**: `bullet%1:06:00::`, `bullet%1:06:01::`, `bullet%1:04:00::`
- **English Definitions**:
  1. *"a projectile that is fired from a gun"*
  2. *"a high-speed passenger train"*
  3. *"(baseball) a pitch thrown with maximum velocity"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, clothing, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `子彈 (義項 1)` | `子彈 (義項 2)` | `子彈 (義項 3)`

---

### 14. `bump` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `撞擊`
- **Source Sense IDs**: `bump%2:35:00::`, `bump%2:40:12::`, `bump%2:38:00::`
- **English Definitions**:
  1. *"knock against with force or violence"*
  2. *"come upon, as if by accident; meet with"*
  3. *"dance erotically or dance with the pelvis thrust forward"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `撞擊 (義項 1)` | `撞擊 (義項 2)` | `撞擊 (義項 3)`

---

### 15. `bundle` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `捆`
- **Source Sense IDs**: `bundle%1:14:00::`, `bundle%1:06:00::`, `bundle%1:21:00::`
- **English Definitions**:
  1. *"a collection of things wrapped or boxed together"*
  2. *"a package of several things tied together for carrying or storing"*
  3. *"a large sum of money (especially as pay or profit)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, transport, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `捆 (義項 1)` | `捆 (義項 2)` | `捆 (義項 3)`

---

### 16. `captain` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `船長`
- **Source Sense IDs**: `captain%1:18:05::`, `captain%1:18:02::`, `captain%1:18:04::`
- **English Definitions**:
  1. *"an officer holding a rank below a major but above a lieutenant"*
  2. *"the naval officer in command of a military ship"*
  3. *"a policeman in charge of a precinct"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, transport, legal). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `船長 (義項 1)` | `船長 (義項 2)` | `船長 (義項 3)`

---

### 17. `champion` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `冠軍（人）`
- **Source Sense IDs**: `champion%1:18:01::`, `champion%1:18:00::`, `champion%1:18:02::`
- **English Definitions**:
  1. *"someone who has won first place in a competition"*
  2. *"someone who fights for a cause"*
  3. *"a person who backs a politician or a team etc."*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `冠軍（人） (義項 1)` | `冠軍（人） (義項 2)` | `冠軍（人） (義項 3)`

---

### 18. `chilly` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `寒冷的`
- **Source Sense IDs**: `chilly%5:00:00:unemotional:00`, `chilly%5:00:00:cold:01`, `chilly%5:00:00:unfriendly:01`
- **English Definitions**:
  1. *"not characterized by emotion"*
  2. *"appreciably or disagreeably cold"*
  3. *"lacking warmth of feeling"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `寒冷的 (義項 1)` | `寒冷的 (義項 2)` | `寒冷的 (義項 3)`

---

### 19. `civil` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `市民的`
- **Source Sense IDs**: `civil%5:00:00:civilian:00`, `civil%3:00:00::`, `civil%3:01:01::`
- **English Definitions**:
  1. *"applying to ordinary citizens as contrasted with the military"*
  2. *"not rude; marked by satisfactory (or especially minimal) adherence to social usages and sufficient but not noteworthy consideration for others"*
  3. *"of or occurring within the state or between or among citizens of the state"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, entertainment, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `市民的 (義項 1)` | `市民的 (義項 2)` | `市民的 (義項 3)`

---

### 20. `clay` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `泥土`
- **Source Sense IDs**: `clay%1:27:00::`, `clay%1:27:02::`, `clay%1:08:00::`
- **English Definitions**:
  1. *"a very fine-grained soil that is plastic when moist but hard when fired"*
  2. *"water soaked soil; soft wet earth"*
  3. *"the dead body of a human being"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, geography, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `泥土 (義項 1)` | `泥土 (義項 2)` | `泥土 (義項 3)`

---

### 21. `clip` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `修剪`
- **Source Sense IDs**: `clip%1:06:00::`, `clip%1:11:00::`, `clip%1:06:01::`
- **English Definitions**:
  1. *"a metal frame or container holding cartridges; can be inserted into an automatic gun"*
  2. *"an instance or single occasion for some event"*
  3. *"any of various small fasteners used to hold loose articles together"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, container, transport, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `修剪 (義項 1)` | `修剪 (義項 2)` | `修剪 (義項 3)`

---

### 22. `cock` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `公雞`
- **Source Sense IDs**: `cock%1:08:00::`, `cock%1:06:00::`, `cock%1:06:01::`
- **English Definitions**:
  1. *"obscene terms for penis"*
  2. *"faucet consisting of a rotating device for regulating flow of a liquid"*
  3. *"the part of a gunlock that strikes the percussion cap when the trigger is pulled"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `公雞 (義項 1)` | `公雞 (義項 2)` | `公雞 (義項 3)`

---

### 23. `conscious` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `有意識的`
- **Source Sense IDs**: `conscious%5:00:00:intended:00`, `conscious%3:00:00::`, `conscious%5:00:00:aware:00`
- **English Definitions**:
  1. *"intentionally conceived"*
  2. *"knowing and perceiving; having awareness of surroundings and sensations and thoughts"*
  3. *"(followed by ‘of’) showing realization or recognition of something"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `有意識的 (義項 1)` | `有意識的 (義項 2)` | `有意識的 (義項 3)`

---

### 24. `crawl` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `爬行`
- **Source Sense IDs**: `crawl%2:38:00::`, `crawl%2:42:01::`, `crawl%2:42:00::`
- **English Definitions**:
  1. *"move slowly; in the case of people or animals with the body near the ground"*
  2. *"feel as if crawling with insects"*
  3. *"be full of"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `爬行 (義項 1)` | `爬行 (義項 2)` | `爬行 (義項 3)`

---

### 25. `dam` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `水壩`
- **Source Sense IDs**: `dam%1:06:00::`, `dam%1:23:00::`, `dam%1:05:00::`
- **English Definitions**:
  1. *"a barrier constructed to contain the flow of water or to keep out the sea"*
  2. *"a metric unit of length equal to ten meters"*
  3. *"female parent of an animal especially domestic livestock"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (geography, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `水壩 (義項 1)` | `水壩 (義項 2)` | `水壩 (義項 3)`

---

### 26. `decade` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `十年`
- **Source Sense IDs**: `decade%1:28:00::`, `decade%1:23:00::`
- **English Definitions**:
  1. *"a period of 10 years"*
  2. *"the cardinal number that is the sum of nine and one; the base of the decimal system"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (time_season, clothing, transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `十年 (義項 1)` | `十年 (義項 2)`

---

### 27. `deck` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `甲板`
- **Source Sense IDs**: `deck%1:06:00::`, `deck%1:06:01::`, `deck%1:14:00::`
- **English Definitions**:
  1. *"any of various platforms built into a vessel"*
  2. *"street name for a packet of illegal drugs"*
  3. *"a pack of 52 playing cards"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, transport, legal, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `甲板 (義項 1)` | `甲板 (義項 2)` | `甲板 (義項 3)`

---

### 28. `decorate` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `裝飾`
- **Source Sense IDs**: `decorate%2:36:00::`, `decorate%2:42:00::`, `decorate%2:41:00::`
- **English Definitions**:
  1. *"make more attractive by adding ornament, colour, etc."*
  2. *"be beautiful to look at"*
  3. *"award a mark of honor, such as a medal, to"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `裝飾 (義項 1)` | `裝飾 (義項 2)` | `裝飾 (義項 3)`

---

### 29. `decrease` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `減少`
- **Source Sense IDs**: `decrease%1:11:00::`, `decrease%1:22:00::`, `decrease%1:07:00::`
- **English Definitions**:
  1. *"a change downward"*
  2. *"a process of becoming smaller or shorter"*
  3. *"the amount by which something decreases"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `減少 (義項 1)` | `減少 (義項 2)` | `減少 (義項 3)`

---

### 30. `dip` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `浸`
- **Source Sense IDs**: `dip%1:25:01::`, `dip%1:25:00::`, `dip%1:18:00::`
- **English Definitions**:
  1. *"a depression in an otherwise level surface"*
  2. *"(physics) the angle that a magnetic needle makes with the plane of the horizon"*
  3. *"a thief who steals from the pockets or purses of others in public places"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, transport, mathematics, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `浸 (義項 1)` | `浸 (義項 2)` | `浸 (義項 3)`

---

### 31. `dock` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `碼頭`
- **Source Sense IDs**: `dock%1:06:02::`, `dock%1:20:00::`, `dock%1:06:01::`
- **English Definitions**:
  1. *"an enclosure in a court of law where the defendant sits during the trial"*
  2. *"any of certain coarse weedy plants with long taproots, sometimes used as table greens or in folk medicine"*
  3. *"a platform built out from the shore into the water and supported by piles; provides access to ships and boats"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (legal, medical, geography, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `碼頭運動` | `碼頭 (義項 2)` | `碼頭 (義項 3)`

---

### 32. `dolphin` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `海豚`
- **Source Sense IDs**: `dolphin%1:05:01::`, `dolphin%1:05:00::`
- **English Definitions**:
  1. *"large slender food and game fish widely distributed in warm seas (especially around Hawaii)"*
  2. *"any of various small toothed whales with a beaklike snout; larger than porpoises"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (geography, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `海豚 (義項 1)` | `海豚 (義項 2)`

---

### 33. `dust` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `灰塵`
- **Source Sense IDs**: `dust%1:27:00::`, `dust%1:27:01::`, `dust%1:27:02::`
- **English Definitions**:
  1. *"fine powdery material such as dry earth or pollen that can be blown about in the air"*
  2. *"the remains of something that has been destroyed or broken up"*
  3. *"free microscopic particles of solid material"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, container, clothing, physical_shatter). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `灰塵 (義項 1)` | `灰塵 (義項 2)` | `灰塵 (義項 3)`

---

### 34. `emergency` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `緊急狀況`
- **Source Sense IDs**: `emergency%1:11:00::`, `emergency%1:26:00::`, `emergency%1:06:00::`
- **English Definitions**:
  1. *"a sudden unforeseen crisis (usually involving danger) that requires immediate action"*
  2. *"a state in which martial law applies"*
  3. *"a brake operated by hand; usually operates by mechanical linkage"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, legal, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `緊急狀況 (義項 1)` | `緊急狀況 (義項 2)` | `緊急狀況 (義項 3)`

---

### 35. `engage(ment)` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `從事`
- **Source Sense IDs**: `engagement%1:04:01::`, `engagement%1:14:00::`, `engagement%1:10:00::`
- **English Definitions**:
  1. *"a hostile meeting of opposing military forces in the course of a war"*
  2. *"a meeting arranged in advance"*
  3. *"a mutual promise to marry"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `從事 (義項 1)` | `從事 (義項 2)` | `從事 (義項 3)`

