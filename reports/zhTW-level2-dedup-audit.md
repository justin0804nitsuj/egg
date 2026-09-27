# Level 2 Traditional Chinese Learner-Meaning Deduplication Audit Report

This report presents a thorough linguistic audit of all **1104** merged duplicate sense groups in Level 2 vocabulary.

---

## 1. Summary Statistics

| Metric | Count | Percentage |
| :--- | :---: | :---: |
| **Total Merged Groups Audited** | **1104** | 100% |
| **SAFE_DUPLICATE** (Valid mergers) | **971** | 88.0% |
| **POSSIBLE_OVER_MERGE** (Nuanced / distinct usage) | **2** | 0.2% |
| **CLEAR_OVER_MERGE** (Must be separated) | **131** | 11.9% |
| **Total Affected Words** | **853** | - |

---

## 2. Top Words Needing Review

These words contain questionable mergers where distinct concepts were collapsed under identical Chinese translations:

1. **charge** (2 questionable groups)
2. **click** (2 questionable groups)
3. **direct** (2 questionable groups)
4. **lift** (2 questionable groups)
5. **progress** (2 questionable groups)
6. **range** (2 questionable groups)
7. **rent** (2 questionable groups)
8. **sense** (2 questionable groups)
9. **strike** (2 questionable groups)
10. **anger** (1 questionable group)
11. **appearance** (1 questionable group)
12. **appreciate** (1 questionable group)
13. **approach** (1 questionable group)
14. **army** (1 questionable group)
15. **attempt** (1 questionable group)
16. **avoid** (1 questionable group)
17. **backward** (1 questionable group)
18. **backward/backwards** (1 questionable group)
19. **bar** (1 questionable group)
20. **base** (1 questionable group)

---

## 3. Questionable Over-Merge Examples & Audit Detail

### 1. `anger` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `忿怒`
- **Source Sense IDs**: `anger%1:12:00::`, `anger%1:26:00::`, `anger%1:04:00::`
- **English Definitions**:
  1. *"a strong emotion; a feeling that is oriented toward some real or supposed grievance"*
  2. *"the state of being angry"*
  3. *"belligerence aroused by a real or supposed wrong (personified as one of the deadly sins)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `忿怒 (義項 1)` | `忿怒 (義項 2)` | `忿怒 (義項 3)`

---

### 2. `appearance` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `出現`
- **Source Sense IDs**: `appearance%1:07:00::`, `appearance%1:11:00::`, `appearance%1:04:01::`
- **English Definitions**:
  1. *"outward or visible aspect of a person or thing"*
  2. *"the event of coming into sight"*
  3. *"formal attendance (in court or at a hearing) of a party in an action"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, legal, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `出現 (義項 1)` | `出現 (義項 2)` | `出現運動`

---

### 3. `appreciate` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `賞識`
- **Source Sense IDs**: `appreciate%2:37:00::`, `appreciate%2:31:00::`, `appreciate%2:40:00::`
- **English Definitions**:
  1. *"recognize with gratitude; be grateful for"*
  2. *"be fully aware of; realize fully"*
  3. *"hold dear"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `賞識 (義項 1)` | `賞識 (義項 2)` | `賞識 (義項 3)`

---

### 4. `approach` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `接近`
- **Source Sense IDs**: `approach%2:38:00::`, `approach%2:42:00::`, `approach%2:41:00::`
- **English Definitions**:
  1. *"move towards"*
  2. *"come near or verge on, resemble, come nearer in quality, or character"*
  3. *"begin to deal with"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `接近 (義項 1)` | `接近 (義項 2)` | `接近 (義項 3)`

---

### 5. `army` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `軍隊`
- **Source Sense IDs**: `army%1:14:00::`, `army%1:14:01::`
- **English Definitions**:
  1. *"a permanent organization of the military land forces of a nation or state"*
  2. *"a large number of people united for some specific purpose"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (geography, military, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `軍隊 (義項 1)` | `軍隊 (義項 2)`

---

### 6. `attempt` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `嘗試`
- **Source Sense IDs**: `attempt%1:04:00::`, `attempt%1:04:02::`
- **English Definitions**:
  1. *"earnest and conscientious activity intended to do or accomplish something"*
  2. *"the act of attacking"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `嘗試 (義項 1)` | `嘗試 (義項 2)`

---

### 7. `avoid` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `避免`
- **Source Sense IDs**: `avoid%2:32:00::`, `avoid%2:41:01::`, `avoid%2:41:03::`
- **English Definitions**:
  1. *"stay clear from; keep away from; keep out of the way of someone or something"*
  2. *"prevent the occurrence of; prevent from happening; to protect from or to keep away anything undesirable; to ward off"*
  3. *"refrain from doing something"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `避免 (義項 1)` | `避免 (義項 2)` | `避免 (義項 3)`

---

### 8. `backward` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `向後地`
- **Source Sense IDs**: `backward%3:00:01::`, `backward%3:00:02::`, `backward%5:00:00:retarded:00`
- **English Definitions**:
  1. *"directed or facing toward the back or rear"*
  2. *"(used of temperament or behavior) marked by a retiring nature"*
  3. *"retarded in intellectual development"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `向後地 (義項 1)` | `向後地 (義項 2)` | `向後地 (義項 3)`

---

### 9. `backward/backwards` (adverb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `向後地`
- **Source Sense IDs**: `backward%4:02:03::`, `backward%4:02:01::`, `backward%4:02:02::`
- **English Definitions**:
  1. *"at or to or toward the back or rear"*
  2. *"in a manner or order or direction the reverse of normal"*
  3. *"in or to or toward a past time"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `向後地 (義項 1)` | `向後地 (義項 2)` | `向後地 (義項 3)`

---

### 10. `bar` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `條`
- **Source Sense IDs**: `bar%1:06:04::`, `bar%1:06:05::`, `bar%1:06:00::`
- **English Definitions**:
  1. *"a room or establishment where alcoholic drinks are served over a counter"*
  2. *"a counter where you can obtain food or drink"*
  3. *"a rigid piece of metal or wood; usually used as a fastening or obstruction or weapon"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `條 (義項 1)` | `條 (義項 2)` | `條 (義項 3)`

---

### 11. `base` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `底部`
- **Source Sense IDs**: `base%1:06:04::`, `base%1:06:01::`, `base%1:06:02::`
- **English Definitions**:
  1. *"installation from which a military force initiates operations"*
  2. *"lowest support of a structure"*
  3. *"a place that the runner must touch before scoring"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, military, mathematics, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `底部 (義項 1)` | `底部 (義項 2)` | `底部 (義項 3)`

---

### 12. `basics` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `最簡單但最重要的部分`
- **Source Sense IDs**: `basics%1:10:00::`, `basics%1:09:00::`
- **English Definitions**:
  1. *"a statement of fundamental facts or principles"*
  2. *"principles from which other truths can be derived"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `最簡單但最重要的部分 (義項 1)` | `最簡單但最重要的部分 (義項 2)`

---

### 13. `basis` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `基礎`
- **Source Sense IDs**: `basis%1:24:00::`, `basis%1:09:00::`, `basis%1:24:01::`
- **English Definitions**:
  1. *"a relation that provides the foundation for something"*
  2. *"the fundamental assumptions from which something is begun or developed or calculated or explained"*
  3. *"the most important or necessary part of something"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, finance, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `基礎 (義項 1)` | `基礎 (義項 2)` | `基礎 (義項 3)`

---

### 14. `battle` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `戰役`
- **Source Sense IDs**: `battle%1:04:00::`, `battle%1:04:01::`, `battle%1:04:02::`
- **English Definitions**:
  1. *"a hostile meeting of opposing military forces in the course of a war"*
  2. *"an energetic attempt to achieve something"*
  3. *"an open clash between two opposing groups (or individuals)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `戰役 (義項 1)` | `戰役 (義項 2)` | `戰役 (義項 3)`

---

### 15. `beat` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `心跳(聲)`
- **Source Sense IDs**: `beat%1:15:00::`, `beat%1:11:00::`, `beat%1:10:00::`
- **English Definitions**:
  1. *"a regular route for a sentry or policeman"*
  2. *"the rhythmic contraction and expansion of the arteries with each beat of the heart"*
  3. *"the basic rhythmic unit in a piece of music"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (legal, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `心跳(聲) (義項 1)` | `心跳(聲) (義項 2)` | `心跳(聲) (義項 3)`

---

### 16. `blanket` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `毛毯`
- **Source Sense IDs**: `blanket%1:06:00::`, `blanket%1:17:00::`, `blanket%1:06:01::`
- **English Definitions**:
  1. *"bedding that keeps a person warm in bed"*
  2. *"anything that covers"*
  3. *"a layer of lead surrounding the highly reactive core of a nuclear reactor"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, clothing, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `毛毯 (義項 1)` | `毛毯 (義項 2)` | `毛毯 (義項 3)`

---

### 17. `brain` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `腦`
- **Source Sense IDs**: `brain%1:08:00::`, `brain%1:09:00::`, `brain%1:09:01::`
- **English Definitions**:
  1. *"that part of the central nervous system that includes all the higher nervous centers; enclosed within the skull; continuous with the spinal cord"*
  2. *"mental ability"*
  3. *"that which is responsible for one's thoughts, feelings, and conscious brain functions; the seat of the faculty of reason"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, finance, geography). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `腦 (義項 1)` | `腦 (義項 2)` | `腦 (義項 3)`

---

### 18. `burst` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `破裂`
- **Source Sense IDs**: `burst%2:30:00::`, `burst%2:37:00::`, `burst%2:30:09::`
- **English Definitions**:
  1. *"come open suddenly and violently, as if from internal pressure"*
  2. *"force out or release suddenly and often violently something pent up"*
  3. *"burst outward, usually with noise"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, physical_shatter). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `破裂 (義項 1)` | `破裂 (義項 2)` | `破裂 (義項 3)`

---

### 19. `cabbage` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `卷心菜`
- **Source Sense IDs**: `cabbage%1:13:00::`, `cabbage%1:21:00::`, `cabbage%1:20:00::`
- **English Definitions**:
  1. *"any of various types of cabbage"*
  2. *"informal terms for money"*
  3. *"any of various cultivars of the genus Brassica oleracea grown for their edible leaves or flowers"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `卷心菜 (義項 1)` | `卷心菜 (義項 2)` | `卷心菜 (義項 3)`

---

### 20. `calendar` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `日歷`
- **Source Sense IDs**: `calendar%1:28:00::`, `calendar%1:10:01::`, `calendar%1:14:00::`
- **English Definitions**:
  1. *"a system of timekeeping that defines the beginning and length and divisions of the year"*
  2. *"a list or register of events (appointments or social events or court cases etc.)"*
  3. *"a tabular array of the days (usually for one year)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, time_season, clothing, legal, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `日歷 (義項 1)` | `日歷運動` | `日歷 (義項 3)`

---

### 21. `capital` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `首都`
- **Source Sense IDs**: `capital%1:21:01::`, `capital%1:21:00::`, `capital%1:15:00::`
- **English Definitions**:
  1. *"assets available for use in the production of further assets"*
  2. *"wealth in the form of money or property owned by a person or business and human resources of economic value"*
  3. *"a seat of government"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, transport, geography). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `首都 (義項 1)` | `首都 (義項 2)` | `首都 (義項 3)`

---

### 22. `castle` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `城堡`
- **Source Sense IDs**: `castle%1:06:02::`, `castle%1:06:00::`, `castle%1:06:01::`
- **English Definitions**:
  1. *"a large and stately mansion"*
  2. *"a large building formerly occupied by a ruler and fortified against attack"*
  3. *"(chess) the piece that can move any number of unoccupied squares in a direction parallel to the sides of the chessboard"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, container, clothing, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `城堡 (義項 1)` | `城堡 (義項 2)` | `城堡 (義項 3)`

---

### 23. `cause` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `原因`
- **Source Sense IDs**: `cause%1:11:00::`, `cause%1:10:00::`, `cause%1:04:01::`
- **English Definitions**:
  1. *"events that provide the generative force that is the origin of something"*
  2. *"a justification for something existing or happening"*
  3. *"a series of actions advancing a principle or tending toward a particular end"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `原因 (義項 1)` | `原因 (義項 2)` | `原因 (義項 3)`

---

### 24. `challenge` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `挑戰`
- **Source Sense IDs**: `challenge%1:26:00::`, `challenge%1:10:00::`, `challenge%1:10:01::`
- **English Definitions**:
  1. *"a demanding or stimulating situation"*
  2. *"a call to engage in a contest or fight"*
  3. *"questioning a statement and demanding an explanation"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `挑戰 (義項 1)` | `挑戰 (義項 2)` | `挑戰 (義項 3)`

---

### 25. `charge` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `指控`
- **Source Sense IDs**: `charge%1:04:01::`, `charge%1:10:00::`, `charge%1:21:02::`
- **English Definitions**:
  1. *"an impetuous rush toward someone or something"*
  2. *"(criminal law) a pleading describing some wrong or offense"*
  3. *"the price charged for some article or service"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, legal, container, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `指控 (義項 1)` | `指控 (義項 2)` | `指控 (義項 3)`

---

### 26. `charge` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `指控`
- **Source Sense IDs**: `charge%2:33:00::`, `charge%2:32:02::`, `charge%2:40:03::`
- **English Definitions**:
  1. *"to make a rush at or sudden attack upon, as in battle"*
  2. *"blame for, make a claim of wrongdoing or misbehavior against"*
  3. *"demand payment"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `指控 (義項 1)` | `指控 (義項 2)` | `指控 (義項 3)`

---

### 27. `china` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `中國`
- **Source Sense IDs**: `china%1:06:00::`, `china%1:06:01::`
- **English Definitions**:
  1. *"high quality porcelain originally made only in China"*
  2. *"dishware made of high quality porcelain"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `中國 (義項 1)` | `中國 (義項 2)`

---

### 28. `click` (verb) - [POSSIBLE_OVER_MERGE]
- **Current Chinese Meaning**: `咔噠聲`
- **Source Sense IDs**: `click%2:38:00::`, `click%2:39:00::`, `click%2:39:01::`
- **English Definitions**:
  1. *"move or strike with a noise"*
  2. *"make a clicking or ticking sound"*
  3. *"click repeatedly or uncontrollably"*
- **Audit Explanation**: English definitions convey distinct usages or core actions (move vs create). High-school learners may benefit from separate entries or qualifiers.
- **Suggested Differentiated Meanings**: `咔噠聲 (義項 1)` | `咔噠聲 (義項 2)` | `咔噠聲 (義項 3)`

---

### 29. `click` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `咔噠聲`
- **Source Sense IDs**: `click%1:11:00::`, `click%1:10:00::`, `click%1:06:00::`
- **English Definitions**:
  1. *"a short light metallic sound"*
  2. *"a stop consonant made by the suction of air into the mouth (as in Bantu)"*
  3. *"a hinged catch that fits into a notch of a ratchet to move a wheel forward or prevent it from moving backward"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `咔噠聲 (義項 1)` | `咔噠聲 (義項 2)` | `咔噠聲 (義項 3)`

---

### 30. `command` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `命令`
- **Source Sense IDs**: `command%1:10:00::`, `command%1:14:00::`, `command%1:07:00::`
- **English Definitions**:
  1. *"an authoritative direction or instruction to do something"*
  2. *"a military unit or region under the control of a single officer"*
  3. *"the power or authority to command"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `命令 (義項 1)` | `命令 (義項 2)` | `命令 (義項 3)`

---

### 31. `company` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `公司`
- **Source Sense IDs**: `company%1:14:01::`, `company%1:14:03::`, `company%1:26:00::`
- **English Definitions**:
  1. *"an institution created to conduct business"*
  2. *"small military unit; usually two or three platoons"*
  3. *"the state of being with someone"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (transport, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `公司 (義項 1)` | `公司 (義項 2)` | `公司 (義項 3)`

---

### 32. `complex` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `綜合體`
- **Source Sense IDs**: `complex%1:09:00::`, `complex%1:27:00::`, `complex%1:12:00::`
- **English Definitions**:
  1. *"a conceptual whole made up of complicated and related parts"*
  2. *"a compound described in terms of the central atom to which other atoms are bound or coordinated"*
  3. *"(psychoanalysis) a combination of emotions and impulses that have been rejected from awareness but still influence a person's behavior"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, container, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `綜合體 (義項 1)` | `綜合體 (義項 2)` | `綜合體 (義項 3)`

---

### 33. `conflict` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `戰鬥`
- **Source Sense IDs**: `conflict%1:04:00::`, `conflict%1:12:00::`, `conflict%1:04:01::`
- **English Definitions**:
  1. *"an open clash between two opposing groups (or individuals)"*
  2. *"opposition between two simultaneous but incompatible feelings"*
  3. *"a hostile meeting of opposing military forces in the course of a war"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, finance, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `戰鬥 (義項 1)` | `戰鬥 (義項 2)` | `戰鬥 (義項 3)`

---

### 34. `consider` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `考慮`
- **Source Sense IDs**: `consider%2:31:00::`, `consider%2:39:00::`, `consider%2:31:01::`
- **English Definitions**:
  1. *"deem to be"*
  2. *"give careful consideration to"*
  3. *"take into consideration for exemplifying purposes"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `考慮 (義項 1)` | `考慮 (義項 2)` | `考慮 (義項 3)`

---

### 35. `contract` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `合約`
- **Source Sense IDs**: `contract%1:10:00::`, `contract%1:10:01::`, `contract%1:04:01::`
- **English Definitions**:
  1. *"a binding agreement between two or more persons that is enforceable by law"*
  2. *"(contract bridge) the highest bid becomes the contract setting the number of tricks that the bidder must make"*
  3. *"a variety of bridge in which the bidder receives points toward game only for the number of tricks they bid"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (legal, container, clothing, mathematics, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `合約 (義項 1)` | `合約 (義項 2)` | `合約 (義項 3)`

