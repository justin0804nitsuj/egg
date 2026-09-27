# Level 1 Learner Meaning Quality Review Queue

**Date:** 2026-09-27  
**Scope:** Level 1 CLEAR_OVER_MERGE Groups (135 Groups Total)  
**Goal:** Human-in-the-loop quality review of over-merged WordNet senses before promoting overrides to production.

---

## Instructions for Reviewers

- **Review Files:**
  - CSV Format: `reports/zhTW-level1-review-queue.csv` (opens natively in Microsoft Excel with UTF-8 encoding).
  - Markdown Format: `reports/zhTW-level1-review-queue.md` (interactive visual review).
- **Decision Column Values:**
  - `APPROVE`: Promote suggested Taiwan Traditional Chinese meanings into production override file (`src/data/wordDefinitionsZhTW_L1_overrides.js`) with `status: "verified"`.
  - `REVISE`: Use custom translation provided in `finalMeaningZhTW` column.
  - `KEEP_MERGED`: Keep current unified Chinese meaning (the senses are synonymous enough for Level 1 learners).
  - `SKIP`: Defer decision.

---

## Detailed Review Cards (First 30 CLEAR_OVER_MERGE Groups)

### 1. Word: **attack** (`attack-51`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `攻擊`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** SPLIT both senses into distinct meanings.
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `attack%1:04:04::` | an offensive move in a sport or game | **攻擊 (體育/競賽)** | | | |
| `attack%1:10:00::` | intense adverse criticism | **攻擊 (概念 2)** | | | |

---

### 2. Word: **bag** (`bag-57`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `袋子`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `bag%1:06:00::` | a flexible container with a single opening | **袋子 (概念 1)** | | | |
| `bag%1:23:01::` | the quantity of game taken in a particular period (usually by one person) | **袋子 (體育/競賽)** | | | |
| `bag%1:06:03::` | a place that the runner must touch before scoring | **袋子 (概念 3)** | | | |

---

### 3. Word: **ball** (`ball-58`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `球`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `ball%1:06:01::` | round object that is hit or thrown or kicked in games | **球 (體育/競賽)** | | | |
| `ball%1:06:03::` | a solid projectile that is shot by a musket | **球 (概念 2)** | | | |
| `ball%1:25:00::` | an object with a spherical shape | **球 (概念 3)** | | | |

---

### 4. Word: **bank** (`bank-61`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `銀行`
- **Over-merge Explanation:** Merges literal item sense with informal/slang money sense.
- **Merge Recommendation:** SPLIT both senses into distinct meanings.
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `bank%1:14:00::` | a financial institution that accepts deposits and channels the money into lending activities | **銀行** | | | |
| `bank%1:17:00::` | a long ridge or pile | **銀行** | | | |

---

### 5. Word: **bank** (`bank-61`)
- **Level:** 1 | **POS:** `verb` | **Current Meaning:** `銀行`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** SPLIT both senses into distinct meanings.
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `bank%2:38:00::` | tip laterally | **銀行** | | | |
| `bank%2:35:00::` | enclose with a bank | **銀行** | | | |

---

### 6. Word: **black** (`black-95`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `黑色`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `black%1:07:00::` | the quality or state of the achromatic color of least lightness (bearing the least resemblance to white) | **黑色 (概念 1)** | | | |
| `black%1:26:00::` | total absence of light | **黑色 (概念 2)** | | | |
| `black%1:06:01::` | (board games) the darker pieces | **黑色 (體育/競賽)** | | | |

---

### 7. Word: **book** (`book-102`)
- **Level:** 1 | **POS:** `verb` | **Current Meaning:** `書`
- **Over-merge Explanation:** Merges common everyday noun sense with police informer slang sense.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `book%2:31:00::` | engage for a performance | **書 (概念 1)** | | | |
| `book%2:41:01::` | arrange for and reserve (something for someone else) in advance | **書 (概念 2)** | | | |
| `book%2:41:00::` | record a charge in a police register | **書 (俚語/告密)** | | | |

---

### 8. Word: **bread** (`bread-116`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `面包`
- **Over-merge Explanation:** Merges literal item sense with informal/slang money sense.
- **Merge Recommendation:** SPLIT both senses into distinct meanings.
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `bread%1:13:00::` | food made from dough of flour or meal and usually raised with yeast or baking powder and then baked | **麵包** | | | |
| `bread%1:21:00::` | informal terms for money | **錢財；鈔票 (口語)** | | | |

---

### 9. Word: **bus** (`bus-126`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `公車`
- **Over-merge Explanation:** Merges distinct mechanical/transportation sub-structures under single general noun.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `bus%1:06:00::` | a vehicle carrying many passengers; used for public transport | **公車 (體育/競賽)** | | | |
| `bus%1:09:00::` | the topology of a network whose components are connected by a busbar | **公車 (概念 2)** | | | |
| `bus%1:06:02::` | an electrical conductor that makes a common connection between several circuits | **公車 (概念 3)** | | | |

---

### 10. Word: **business** (`business-127`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `生意`
- **Over-merge Explanation:** Merges literal item sense with informal/slang money sense.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `business%1:14:00::` | a commercial or industrial enterprise and the people who constitute it | **商業；生意** | | | |
| `business%1:04:01::` | the activity of providing goods and services involving financial and commercial and industrial aspects | **商業；生意** | | | |
| `business%1:04:00::` | the principal activity in your life that you do to earn money | **生意** | | | |

---

### 11. Word: **buy** (`buy-133`)
- **Level:** 1 | **POS:** `verb` | **Current Meaning:** `買`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `buy%2:40:00::` | obtain by purchase; acquire by means of a financial transaction | **買 (財務/金額)** | | | |
| `buy%2:40:02::` | make illegal payments to in exchange for favors or influence | **買 (法律/審判)** | | | |
| `buy%2:42:00::` | be worth or be capable of buying | **買 (概念 3)** | | | |

---

### 12. Word: **car** (`car-141`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `汽車`
- **Over-merge Explanation:** Merges distinct mechanical/transportation sub-structures under single general noun.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `car%1:06:00::` | a motor vehicle with four wheels; usually propelled by an internal combustion engine | **汽車；轎車** | | | |
| `car%1:06:01::` | a wheeled vehicle adapted to the rails of railroad | **汽車** | | | |
| `car%1:06:03::` | the compartment that is suspended from an airship and that carries personnel and the cargo and the power plant | **汽車** | | | |

---

### 13. Word: **card** (`card-142`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `卡片`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `card%1:06:00::` | one of a set of small pieces of stiff paper marked in various ways and used for playing games or for telling fortunes | **卡片 (體育/競賽)** | | | |
| `card%1:10:01::` | a card certifying the identity of the bearer | **卡片 (概念 2)** | | | |
| `card%1:10:00::` | a rectangular piece of stiff paper used to send messages (may have printed greetings or pictures) | **卡片 (概念 3)** | | | |

---

### 14. Word: **case** (`case-147`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `情形`
- **Over-merge Explanation:** Merges general occurrence/meaning with formal legal/court sense.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `case%1:11:00::` | an occurrence of something | **具體情況；實例** | | | |
| `case%1:26:00::` | a special set of circumstances | **情形** | | | |
| `case%1:04:00::` | a comprehensive term for any proceeding in a court of law whereby an individual seeks a legal remedy | **訴訟案；案件** | | | |

---

### 15. Word: **check** (`check-159`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `檢查`
- **Over-merge Explanation:** Merges literal item sense with informal/slang money sense.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `check%1:21:00::` | a written order directing a bank to pay money | **支票** | | | |
| `check%1:09:00::` | an appraisal of the state of affairs | **檢查** | | | |
| `check%1:10:00::` | the bill in a restaurant | **檢查** | | | |

---

### 16. Word: **close** (`close-175`)
- **Level:** 1 | **POS:** `adjective` | **Current Meaning:** `關閉；靠近的`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `close%3:00:01::` | at or within a short distance in space or time or having elements near each other | **靠近的；親近的** | | | |
| `close%3:00:02::` | close in relevance or relationship | **關閉；靠近的** | | | |
| `close%3:00:05::` | not far distant in time or space or degree or circumstances | **關閉；靠近的** | | | |

---

### 17. Word: **close** (`close-175`)
- **Level:** 1 | **POS:** `adverb` | **Current Meaning:** `關閉；靠近的`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** SPLIT both senses into distinct meanings.
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `close%4:02:01::` | near in time or place or relationship | **靠近的；親近的** | | | |
| `close%4:02:02::` | in an attentive manner | **關閉；靠近的** | | | |

---

### 18. Word: **copy** (`copy-192`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `副本`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `copy%1:10:00::` | a reproduction of a written record (e.g. of a legal or school record) | **副本 (法律/審判)** | | | |
| `copy%1:06:00::` | a thing made to be similar or identical to another thing | **副本 (概念 2)** | | | |
| `copy%1:10:01::` | matter to be printed; exclusive of graphical materials | **副本 (概念 3)** | | | |

---

### 19. Word: **cost** (`cost-195`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `代價`
- **Over-merge Explanation:** Merges literal item sense with informal/slang money sense.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `cost%1:21:00::` | the total spent for goods or services including money and time and labor | **代價 (財務/金額)** | | | |
| `cost%1:07:00::` | the property of having material worth (often indicated by the amount of money something would bring if sold) | **代價 (財務/金額)** | | | |
| `cost%1:07:01::` | value measured by what must be given or done or undergone to obtain something | **代價 (概念 3)** | | | |

---

### 20. Word: **dear** (`dear-217`)
- **Level:** 1 | **POS:** `adjective` | **Current Meaning:** `親愛的人`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `dear%5:00:00:loved:00` | dearly loved | **親愛的人 (概念 1)** | | | |
| `dear%5:00:00:close:02` | with or in a close or intimate relationship | **親愛的人 (概念 2)** | | | |
| `dear%5:00:00:sincere:00` | sincerely earnest | **親愛的人 (概念 3)** | | | |

---

### 21. Word: **doctor/doc** (`doctor/doc-232`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `醫生`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** SPLIT both senses into distinct meanings.
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `doctor%1:18:00::` | a licensed medical practitioner | **醫生 (概念 1)** | | | |
| `doctor%1:04:00::` | children take the roles of physician or patient or nurse and pretend they are at the physician's office | **醫生 (概念 2)** | | | |

---

### 22. Word: **dollar** (`dollar-235`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `美元`
- **Over-merge Explanation:** Merges literal item sense with informal/slang money sense.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `dollar%1:23:00::` | the basic monetary unit in many countries; equal to 100 cents | **美元 (概念 1)** | | | |
| `dollar%1:21:00::` | a piece of paper money worth one dollar | **美元 (財務/金額)** | | | |
| `dollar%1:21:01::` | a United States coin worth one dollar | **美元 (概念 3)** | | | |

---

### 23. Word: **enjoy(ment)** (`enjoy(ment)-264`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `享受`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `enjoyment%1:12:00::` | the pleasure felt when having a good time | **享受 (概念 1)** | | | |
| `enjoyment%1:04:00::` | act of receiving pleasure from something | **享受 (概念 2)** | | | |
| `enjoyment%1:07:00::` | (law) the exercise of the legal right to enjoy the benefits of owning property | **享受 (法律/審判)** | | | |

---

### 24. Word: **fan** (`fan-294`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `風扇`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `fan%1:06:00::` | a device for creating a current of air by movement of a surface or surfaces | **風扇 (概念 1)** | | | |
| `fan%1:18:01::` | an enthusiastic devotee of sports | **風扇 (體育/競賽)** | | | |
| `fan%1:18:00::` | an ardent follower and admirer | **風扇 (概念 3)** | | | |

---

### 25. Word: **file** (`file-306`)
- **Level:** 1 | **POS:** `verb` | **Current Meaning:** `檔案`
- **Over-merge Explanation:** Merges general occurrence/meaning with formal legal/court sense.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `file%2:32:02::` | record in a public office or in a court of law | **檔案 (法律/審判)** | | | |
| `file%2:35:00::` | smooth with a file | **檔案 (概念 2)** | | | |
| `file%2:38:00::` | proceed in line | **檔案 (概念 3)** | | | |

---

### 26. Word: **game** (`game-340`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `比賽`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `game%1:04:00::` | a contest with rules to determine a winner | **比賽 (概念 1)** | | | |
| `game%1:04:03::` | a single play of a sport or other contest | **比賽 (體育/競賽)** | | | |
| `game%1:04:01::` | an amusement or pastime | **比賽 (概念 3)** | | | |

---

### 27. Word: **gate** (`gate-342`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `門`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `gate%1:06:00::` | a movable barrier in a fence or wall | **門 (概念 1)** | | | |
| `gate%1:06:01::` | a computer circuit with several inputs but only one output that can be activated by particular combinations of inputs | **門 (概念 2)** | | | |
| `gate%1:21:00::` | total admission receipts at a sports event | **門 (體育/競賽)** | | | |

---

### 28. Word: **ghost** (`ghost-344`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `鬼`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `ghost%1:09:00::` | a mental representation of some haunting experience | **鬼 (概念 1)** | | | |
| `ghost%1:18:01::` | a writer who gives the credit of authorship to someone else | **鬼 (概念 2)** | | | |
| `ghost%1:18:00::` | the visible disembodied soul of a dead person | **鬼 (概念 3)** | | | |

---

### 29. Word: **grass** (`grass-360`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `草`
- **Over-merge Explanation:** Merges common everyday noun sense with police informer slang sense.
- **Merge Recommendation:** KEEP synonymous senses merged; SPLIT distinct domain senses (total 3 senses).
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `grass%1:20:00::` | narrow-leaved green herbage: grown as lawns; used as pasture for grazing animals; cut and dried as hay | **草；草坪** | | | |
| `grass%1:18:01::` | a police informer who implicates many people | **線人；告密者 (俚語)** | | | |
| `grass%1:13:00::` | bulky food like grass or hay for browsing or grazing horses or cattle | **草** | | | |

---

### 30. Word: **half** (`half-372`)
- **Level:** 1 | **POS:** `noun` | **Current Meaning:** `一半`
- **Over-merge Explanation:** Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation.
- **Merge Recommendation:** SPLIT both senses into distinct meanings.
- **Review Status:** `NEEDS_REVIEW`

| Sense ID | English WordNet Definition | Suggested Taiwan Traditional Chinese Meaning | Review Decision | Final Meaning | Notes |
|---|---|---|---|---|---|
| `half%1:23:00::` | one of two equal parts of a divisible whole | **一半 (概念 1)** | | | |
| `half%1:28:00::` | one of two divisions into which some games or performances are divided: the two divisions are separated by an interval | **一半 (體育/競賽)** | | | |

---

## Complete Level 1 Review Queue Table (135 Groups)

| # | Word | Word ID | POS | Current Meaning | Senses Count | Over-merge Explanation | Review Status |
|---|---|---|---|---|---|---|---|
| 1 | **attack** | `attack-51` | `noun` | 攻擊 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 2 | **bag** | `bag-57` | `noun` | 袋子 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 3 | **ball** | `ball-58` | `noun` | 球 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 4 | **bank** | `bank-61` | `noun` | 銀行 | 2 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 5 | **bank** | `bank-61` | `verb` | 銀行 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 6 | **black** | `black-95` | `noun` | 黑色 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 7 | **book** | `book-102` | `verb` | 書 | 3 | Merges common everyday noun sense with police informer slang sense. | `NEEDS_REVIEW` |
| 8 | **bread** | `bread-116` | `noun` | 面包 | 2 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 9 | **bus** | `bus-126` | `noun` | 公車 | 3 | Merges distinct mechanical/transportation sub-structures under single general noun. | `NEEDS_REVIEW` |
| 10 | **business** | `business-127` | `noun` | 生意 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 11 | **buy** | `buy-133` | `verb` | 買 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 12 | **car** | `car-141` | `noun` | 汽車 | 3 | Merges distinct mechanical/transportation sub-structures under single general noun. | `NEEDS_REVIEW` |
| 13 | **card** | `card-142` | `noun` | 卡片 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 14 | **case** | `case-147` | `noun` | 情形 | 3 | Merges general occurrence/meaning with formal legal/court sense. | `NEEDS_REVIEW` |
| 15 | **check** | `check-159` | `noun` | 檢查 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 16 | **close** | `close-175` | `adjective` | 關閉；靠近的 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 17 | **close** | `close-175` | `adverb` | 關閉；靠近的 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 18 | **copy** | `copy-192` | `noun` | 副本 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 19 | **cost** | `cost-195` | `noun` | 代價 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 20 | **dear** | `dear-217` | `adjective` | 親愛的人 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 21 | **doctor/doc** | `doctor/doc-232` | `noun` | 醫生 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 22 | **dollar** | `dollar-235` | `noun` | 美元 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 23 | **enjoy(ment)** | `enjoy(ment)-264` | `noun` | 享受 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 24 | **fan** | `fan-294` | `noun` | 風扇 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 25 | **file** | `file-306` | `verb` | 檔案 | 3 | Merges general occurrence/meaning with formal legal/court sense. | `NEEDS_REVIEW` |
| 26 | **game** | `game-340` | `noun` | 比賽 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 27 | **gate** | `gate-342` | `noun` | 門 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 28 | **ghost** | `ghost-344` | `noun` | 鬼 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 29 | **grass** | `grass-360` | `noun` | 草 | 3 | Merges common everyday noun sense with police informer slang sense. | `NEEDS_REVIEW` |
| 30 | **half** | `half-372` | `noun` | 一半 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 31 | **health** | `health-385` | `noun` | 健康 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 32 | **hear** | `hear-387` | `verb` | 聽到 | 3 | Merges general occurrence/meaning with formal legal/court sense. | `NEEDS_REVIEW` |
| 33 | **heavy** | `heavy-390` | `adjective` | 重的 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 34 | **here** | `here-396` | `adverb` | 在這裡 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 35 | **high** | `high-398` | `adjective` | 高度 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 36 | **hill** | `hill-399` | `noun` | 小山 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 37 | **hospital** | `hospital-411` | `noun` | 醫院 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 38 | **in** | `in-428` | `adjective` | 在...期間 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 39 | **job** | `job-443` | `noun` | 工作 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 40 | **jump** | `jump-448` | `verb` | 跳躍 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 41 | **just** | `just-449` | `adjective` | 正直的 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 42 | **keep** | `keep-450` | `noun` | 生計 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 43 | **kick** | `kick-452` | `noun` | 踢 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 44 | **kill** | `kill-454` | `verb` | 殺 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 45 | **kill** | `kill-454` | `noun` | 殺 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 46 | **kite** | `kite-459` | `noun` | 風箏 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 47 | **know** | `know-463` | `verb` | 知道 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 48 | **learn** | `learn-478` | `verb` | 學習 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 49 | **left** | `left-481` | `adjective` | 左邊的 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 50 | **left** | `left-481` | `noun` | 左邊的 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 51 | **lesson** | `lesson-485` | `noun` | 課 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 52 | **light** | `light-492` | `adjective` | 光 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 53 | **lonely** | `lonely-501` | `adjective` | 孤單的 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 54 | **look** | `look-503` | `verb` | 一看 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 55 | **look** | `look-503` | `noun` | 一看 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 56 | **love** | `love-507` | `noun` | 愛 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 57 | **low** | `low-509` | `adjective` | 低點 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 58 | **mail** | `mail-515` | `noun` | 郵件 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 59 | **map** | `map-520` | `noun` | 地圖 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 60 | **medicine** | `medicine-532` | `noun` | 藥 | 3 | Merges distinct mechanical/transportation sub-structures under single general noun. | `NEEDS_REVIEW` |
| 61 | **mine** | `mine-542` | `noun` | 我的；礦 | 2 | Merges distinct mechanical/transportation sub-structures under single general noun. | `NEEDS_REVIEW` |
| 62 | **money** | `money-548` | `noun` | 金錢 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 63 | **near** | `near-572` | `adverb` | 近的 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 64 | **need** | `need-574` | `noun` | 需要 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 65 | **night** | `night-582` | `noun` | 夜 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 66 | **north** | `north-588` | `noun` | 北方 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 67 | **nose** | `nose-589` | `noun` | 鼻子 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 68 | **officer** | `officer-602` | `noun` | 軍官 | 2 | Merges common everyday noun sense with police informer slang sense. | `NEEDS_REVIEW` |
| 69 | **on** | `on-606` | `adverb` | 在...之上 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 70 | **order** | `order-613` | `noun` | 次序 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 71 | **paint** | `paint-622` | `noun` | 油漆 | 3 | Merges general occurrence/meaning with formal legal/court sense. | `NEEDS_REVIEW` |
| 72 | **park** | `park-627` | `noun` | 公園 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 73 | **pass** | `pass-630` | `noun` | 經過 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 74 | **pay(ment)** | `pay(ment)-632` | `verb` | 付錢 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 75 | **pay(ment)** | `pay(ment)-632` | `noun` | 付錢 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 76 | **pet** | `pet-638` | `noun` | 寵物 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 77 | **pipe** | `pipe-649` | `verb` | 管 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 78 | **play** | `play-655` | `verb` | 遊戲 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 79 | **play** | `play-655` | `noun` | 遊戲 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 80 | **player** | `player-656` | `noun` | 競賽者（人） | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 81 | **pocket** | `pocket-660` | `noun` | 口袋 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 82 | **poor** | `poor-666` | `adjective` | 貧窮的 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 83 | **pot** | `pot-670` | `noun` | 盆 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 84 | **price** | `price-677` | `noun` | 價格 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 85 | **pull** | `pull-683` | `verb` | 拉 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 86 | **pull** | `pull-683` | `noun` | 拉 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 87 | **quarter** | `quarter-686` | `noun` | 四分之一 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 88 | **race** | `race-693` | `verb` | 種族 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 89 | **raise** | `raise-698` | `noun` | 上升 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 90 | **reach** | `reach-699` | `verb` | 伸出 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 91 | **ready** | `ready-701` | `adjective` | 預備好的狀態 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 92 | **relative** | `relative-706` | `noun` | 親戚 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 93 | **right** | `right-716` | `adjective` | 右邊；正確的；權利 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 94 | **rise** | `rise-718` | `noun` | 上升 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 95 | **rise** | `rise-718` | `verb` | 上升 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 96 | **road** | `road-720` | `noun` | 路 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 97 | **roll** | `roll-723` | `noun` | 卷 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 98 | **round** | `round-728` | `adjective` | 圓 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 99 | **round** | `round-728` | `noun` | 圓 | 3 | Merges common everyday noun sense with police informer slang sense. | `NEEDS_REVIEW` |
| 100 | **sell** | `sell-750` | `verb` | 賣 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 101 | **service** | `service-754` | `noun` | 服務 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 102 | **set** | `set-755` | `noun` | 放置；一組 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 103 | **share** | `share-760` | `noun` | 部分 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 104 | **ship** | `ship-764` | `verb` | 船 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 105 | **shoe(s)** | `shoe(s)-766` | `noun` | 鞋子 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 106 | **south** | `south-813` | `noun` | 南方 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 107 | **spring** | `spring-819` | `verb` | 春天 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 108 | **square** | `square-820` | `noun` | 正方形 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 109 | **start** | `start-824` | `noun` | 驚起 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 110 | **station** | `station-825` | `noun` | 車站 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 111 | **sugar** | `sugar-841` | `noun` | 糖 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 112 | **sun** | `sun-842` | `noun` | 太陽 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 113 | **surprise** | `surprise-846` | `verb` | 驚奇 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 114 | **table** | `table-849` | `noun` | 桌子 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 115 | **team** | `team-860` | `noun` | 隊 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 116 | **temple** | `temple-865` | `noun` | 聖堂 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 117 | **test** | `test-868` | `verb` | 測試 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 118 | **theater** | `theater-873` | `noun` | 戲院 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 119 | **then** | `then-874` | `adverb` | 然後 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 120 | **there** | `there-875` | `adverb` | 在那裡 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 121 | **ticket** | `ticket-890` | `noun` | 票 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 122 | **tie** | `tie-892` | `noun` | 帶子 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 123 | **tie** | `tie-892` | `verb` | 帶子 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 124 | **tip** | `tip-895` | `noun` | 尖端；小費；提示 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 125 | **toilet** | `toilet-901` | `noun` | 廁所 | 3 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 126 | **traffic** | `traffic-915` | `verb` | 交通 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 127 | **train** | `train-916` | `noun` | 火車 | 3 | Merges distinct mechanical/transportation sub-structures under single general noun. | `NEEDS_REVIEW` |
| 128 | **treat(ment)** | `treat(ment)-917` | `noun` | 對待 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 129 | **turn** | `turn-924` | `noun` | 轉彎 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 130 | **watch** | `watch-949` | `noun` | 觀察 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 131 | **wet** | `wet-962` | `adjective` | 濕的 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 132 | **white** | `white-969` | `noun` | 白色 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 133 | **will** | `will-975` | `noun` | 將；會 | 3 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
| 134 | **win** | `win-976` | `noun` | 贏得 | 2 | Merges literal item sense with informal/slang money sense. | `NEEDS_REVIEW` |
| 135 | **wrong** | `wrong-992` | `noun` | 錯誤的 | 2 | Merges distinct domain-specific or contextual WordNet senses under a single general Chinese translation. | `NEEDS_REVIEW` |
