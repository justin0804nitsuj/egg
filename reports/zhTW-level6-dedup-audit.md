# Level 6 Traditional Chinese Learner-Meaning Deduplication Audit Report

This report presents a thorough linguistic audit of all **838** merged duplicate sense groups in Level 6 vocabulary.

---

## 1. Summary Statistics

| Metric | Count | Percentage |
| :--- | :---: | :---: |
| **Total Merged Groups Audited** | **838** | 100% |
| **SAFE_DUPLICATE** (Valid mergers) | **773** | 92.2% |
| **POSSIBLE_OVER_MERGE** (Nuanced / distinct usage) | **2** | 0.2% |
| **CLEAR_OVER_MERGE** (Must be separated) | **63** | 7.5% |
| **Total Affected Words** | **729** | - |

---

## 2. Top Words Needing Review

These words contain questionable mergers where distinct concepts were collapsed under identical Chinese translations:

1. **harass(ment)** (2 questionable groups)
2. **addiction** (1 questionable group)
3. **avert** (1 questionable group)
4. **aviation** (1 questionable group)
5. **boxing** (1 questionable group)
6. **breakup** (1 questionable group)
7. **brotherhood** (1 questionable group)
8. **casualty** (1 questionable group)
9. **concession** (1 questionable group)
10. **cozy** (1 questionable group)
11. **cub** (1 questionable group)
12. **cultivate** (1 questionable group)
13. **descent** (1 questionable group)
14. **dismay** (1 questionable group)
15. **dispose** (1 questionable group)
16. **diversion** (1 questionable group)
17. **downward** (1 questionable group)
18. **dresser** (1 questionable group)
19. **enrich(ment)** (1 questionable group)
20. **familiarity** (1 questionable group)

---

## 3. Questionable Over-Merge Examples & Audit Detail

### 1. `addiction` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `入迷`
- **Source Sense IDs**: `addiction%1:26:00::`, `addiction%1:12:00::`, `addiction%1:04:00::`
- **English Definitions**:
  1. *"being abnormally tolerant to and dependent on something that is psychologically or physically habit-forming (especially alcohol or narcotic drugs)"*
  2. *"an abnormally strong craving"*
  3. *"(Roman law) a formal award by a magistrate of a thing or person to another person (as the award of a debtor to their creditor); a surrender to a master"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, finance, legal, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `入迷 (義項 1)` | `入迷 (義項 2)` | `入迷 (義項 3)`

---

### 2. `avert` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `轉開`
- **Source Sense IDs**: `avert%2:41:00::`, `avert%2:38:00::`
- **English Definitions**:
  1. *"prevent the occurrence of; prevent from happening; to protect from or to keep away anything undesirable; to ward off"*
  2. *"turn away or aside"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `轉開 (義項 1)` | `轉開 (義項 2)`

---

### 3. `aviation` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `航空`
- **Source Sense IDs**: `aviation%1:14:00::`, `aviation%1:14:01::`, `aviation%1:09:00::`
- **English Definitions**:
  1. *"the aggregation of a country's military aircraft"*
  2. *"the operation of aircraft to provide transportation"*
  3. *"the art of operating aircraft"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, transport, entertainment, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `航空 (義項 1)` | `航空 (義項 2)` | `航空 (義項 3)`

---

### 4. `boxing` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `拳擊`
- **Source Sense IDs**: `boxing%1:04:00::`, `boxing%1:04:01::`
- **English Definitions**:
  1. *"fighting with the fists"*
  2. *"the enclosure of something in a package or box"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `拳擊 (義項 1)` | `拳擊 (義項 2)`

---

### 5. `breakup` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `分裂`
- **Source Sense IDs**: `breakup%1:04:00::`, `breakup%1:11:00::`
- **English Definitions**:
  1. *"the termination or disintegration of a relationship (between persons or nations)"*
  2. *"coming apart"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `分裂 (義項 1)` | `分裂 (義項 2)`

---

### 6. `brotherhood` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `手足情誼`
- **Source Sense IDs**: `brotherhood%1:24:00::`, `brotherhood%1:14:00::`, `brotherhood%1:12:00::`
- **English Definitions**:
  1. *"the kinship relation between a male offspring and the siblings"*
  2. *"people engaged in a particular occupation"*
  3. *"the feeling that men should treat one another like brothers"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (time_season, transport, container, finance, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `手足情誼 (義項 1)` | `手足情誼 (義項 2)` | `手足情誼 (義項 3)`

---

### 7. `casualty` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `意外事故`
- **Source Sense IDs**: `casualty%1:18:01::`, `casualty%1:18:00::`, `casualty%1:11:02::`
- **English Definitions**:
  1. *"someone injured or killed or captured or missing in a military engagement"*
  2. *"someone injured or killed in an accident"*
  3. *"an accident that causes someone to die"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `意外事故 (義項 1)` | `意外事故 (義項 2)` | `意外事故 (義項 3)`

---

### 8. `concession` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `特許`
- **Source Sense IDs**: `concession%1:10:00::`, `concession%1:10:02::`, `concession%1:10:01::`
- **English Definitions**:
  1. *"a contract granting the right to operate a subsidiary business"*
  2. *"the act of conceding or yielding"*
  3. *"a point conceded or yielded"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (legal, entertainment, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `特許 (義項 1)` | `特許 (義項 2)` | `特許 (義項 3)`

---

### 9. `cozy` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `舒適的`
- **Source Sense IDs**: `cozy%5:00:00:comfortable:00`, `cozy%5:00:00:friendly:01`, `cozy%5:00:00:close:02`
- **English Definitions**:
  1. *"enjoying or affording comforting warmth and shelter especially in a small space"*
  2. *"having or fostering a warm or friendly and informal atmosphere"*
  3. *"suggesting connivance"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `舒適的 (義項 1)` | `舒適的 (義項 2)` | `舒適的 (義項 3)`

---

### 10. `cub` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `幼獸`
- **Source Sense IDs**: `cub%1:18:01::`, `cub%1:18:00::`, `cub%1:05:00::`
- **English Definitions**:
  1. *"an awkward and inexperienced youth"*
  2. *"a male child (a familiar term of address to a boy)"*
  3. *"the young of certain carnivorous mammals such as the bear or wolf or lion"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, clothing, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `幼獸 (義項 1)` | `幼獸 (義項 2)` | `幼獸 (義項 3)`

---

### 11. `cultivate` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `培養`
- **Source Sense IDs**: `cultivate%2:36:01::`, `cultivate%2:41:00::`, `cultivate%2:30:01::`
- **English Definitions**:
  1. *"prepare for crops"*
  2. *"teach or refine to be discriminative in taste or judgment"*
  3. *"adapt (a wild plant or unclaimed land) to the environment"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, geography). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `培養 (義項 1)` | `培養 (義項 2)` | `培養 (義項 3)`

---

### 12. `descent` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `降落`
- **Source Sense IDs**: `descent%1:11:00::`, `descent%1:07:00::`, `descent%1:04:00::`
- **English Definitions**:
  1. *"a movement downward"*
  2. *"properties attributable to your ancestry"*
  3. *"the act of changing your location in a downward direction"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `降落 (義項 1)` | `降落 (義項 2)` | `降落 (義項 3)`

---

### 13. `dismay` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `沮喪`
- **Source Sense IDs**: `dismay%1:12:02::`, `dismay%1:12:00::`
- **English Definitions**:
  1. *"the feeling of despair in the face of obstacles"*
  2. *"fear resulting from the awareness of danger"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `沮喪 (義項 1)` | `沮喪 (義項 2)`

---

### 14. `dispose` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `處理`
- **Source Sense IDs**: `dispose%2:40:11::`, `dispose%2:40:00::`, `dispose%2:31:00::`
- **English Definitions**:
  1. *"give, sell, or transfer to another"*
  2. *"throw or cast away"*
  3. *"make receptive or willing towards an action or attitude or belief"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `處理 (義項 1)` | `處理 (義項 2)` | `處理 (義項 3)`

---

### 15. `diversion` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `轉移`
- **Source Sense IDs**: `diversion%1:04:00::`, `diversion%1:04:01::`, `diversion%1:04:02::`
- **English Definitions**:
  1. *"an activity that diverts or amuses or stimulates"*
  2. *"a turning aside (of your course or attention or concern)"*
  3. *"an attack calculated to draw enemy defense away from the point of the principal attack"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `轉移 (義項 1)` | `轉移 (義項 2)` | `轉移 (義項 3)`

---

### 16. `downward` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `向下的`
- **Source Sense IDs**: `downward%5:00:00:descending:00`, `downward%5:00:00:down:00`
- **English Definitions**:
  1. *"extending or moving from a higher to a lower place"*
  2. *"on or toward a surface regarded as a base"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `向下的 (義項 1)` | `向下的 (義項 2)`

---

### 17. `dresser` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `化妝臺`
- **Source Sense IDs**: `dresser%1:06:00::`, `dresser%1:18:00::`
- **English Definitions**:
  1. *"furniture with drawers for keeping clothes"*
  2. *"a wardrobe assistant for an actor"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, entertainment, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `化妝臺 (義項 1)` | `化妝臺 (義項 2)`

---

### 18. `enrich(ment)` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `使富足`
- **Source Sense IDs**: `enrichment%1:04:00::`, `enrichment%1:21:00::`
- **English Definitions**:
  1. *"act of making fuller or more meaningful or rewarding"*
  2. *"a gift that significantly increases the recipient's wealth"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, container, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `使富足 (義項 1)` | `使富足 (義項 2)`

---

### 19. `familiarity` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `熟悉`
- **Source Sense IDs**: `familiarity%1:09:00::`, `familiarity%1:07:01::`, `familiarity%1:07:02::`
- **English Definitions**:
  1. *"personal knowledge or information about someone or something"*
  2. *"usualness by virtue of being familiar or well known"*
  3. *"close or warm friendship"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `熟悉 (義項 1)` | `熟悉 (義項 2)` | `熟悉 (義項 3)`

---

### 20. `fin` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `鰭`
- **Source Sense IDs**: `fin%1:23:00::`, `fin%1:06:03::`, `fin%1:06:01::`
- **English Definitions**:
  1. *"the cardinal number that is the sum of four and one"*
  2. *"one of a pair of decorations projecting above the rear fenders of an automobile"*
  3. *"one of a set of parallel slats in a door or window to admit air and reject rain"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `鰭 (義項 1)` | `鰭 (義項 2)` | `鰭 (義項 3)`

---

### 21. `flourish` (verb) - [POSSIBLE_OVER_MERGE]
- **Current Chinese Meaning**: `繁榮`
- **Source Sense IDs**: `flourish%2:30:01::`, `flourish%2:40:00::`, `flourish%2:35:00::`
- **English Definitions**:
  1. *"grow vigorously"*
  2. *"make steady progress; be at the high point in one's career or reach a high point in historical significance or importance"*
  3. *"move or swing back and forth"*
- **Audit Explanation**: English definitions convey distinct usages or core actions (create vs move). High-school learners may benefit from separate entries or qualifiers.
- **Suggested Differentiated Meanings**: `繁榮 (義項 1)` | `繁榮 (義項 2)` | `繁榮 (義項 3)`

---

### 22. `foe` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `仇敵`
- **Source Sense IDs**: `foe%1:18:01::`, `foe%1:18:00::`
- **English Definitions**:
  1. *"an armed adversary (especially a member of an opposing military force)"*
  2. *"a personal enemy"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `仇敵 (義項 1)` | `仇敵 (義項 2)`

---

### 23. `fortify` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `設要塞於`
- **Source Sense IDs**: `fortify%2:30:01::`, `fortify%2:35:00::`, `fortify%2:33:00::`
- **English Definitions**:
  1. *"make strong or stronger"*
  2. *"enclose by or as if by a fortification"*
  3. *"prepare oneself for a military confrontation"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `設要塞於 (義項 1)` | `設要塞於 (義項 2)` | `設要塞於 (義項 3)`

---

### 24. `gauge` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `標準度量`
- **Source Sense IDs**: `gauge%1:06:00::`, `gauge%1:24:00::`, `gauge%1:07:00::`
- **English Definitions**:
  1. *"a measuring instrument for measuring and indicating a quantity such as the thickness of wire or the amount of rain etc."*
  2. *"accepted or approved instance or example of a quantity or quality against which others are judged or measured or compared"*
  3. *"the distance between the rails of a railway or between the wheels of a train"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, legal, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `標準度量 (義項 1)` | `標準度量 (義項 2)` | `標準度量 (義項 3)`

---

### 25. `hacker` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `駭客`
- **Source Sense IDs**: `hacker%1:18:01::`, `hacker%1:18:00::`
- **English Definitions**:
  1. *"a programmer for whom computing is its own reward; may enjoy the challenge of breaking into other computers but does no harm"*
  2. *"one who works hard at boring tasks"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, physical_shatter). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `駭客 (義項 1)` | `駭客 (義項 2)`

---

### 26. `harass(ment)` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `騷擾`
- **Source Sense IDs**: `harass%2:37:00::`, `harass%2:33:00::`
- **English Definitions**:
  1. *"annoy continually or chronically"*
  2. *"exhaust by attacking repeatedly"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `騷擾 (義項 1)` | `騷擾 (義項 2)`

---

### 27. `harass(ment)` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `騷擾`
- **Source Sense IDs**: `harassment%1:12:00::`, `harassment%1:04:00::`
- **English Definitions**:
  1. *"a feeling of intense annoyance caused by being tormented"*
  2. *"the act of tormenting by continued persistent attacks and criticism"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `騷擾 (義項 1)` | `騷擾 (義項 2)`

---

### 28. `hearty` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `誠懇的`
- **Source Sense IDs**: `hearty%5:00:00:warm:02`, `hearty%5:00:00:wholesome:00`, `hearty%5:00:02:healthy:00`
- **English Definitions**:
  1. *"showing warm and heartfelt friendliness"*
  2. *"providing abundant nourishment"*
  3. *"endowed with or exhibiting great bodily or mental health"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `誠懇的 (義項 1)` | `誠懇的 (義項 2)` | `誠懇的 (義項 3)`

---

### 29. `incline` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `傾斜`
- **Source Sense IDs**: `incline%2:42:01::`, `incline%2:39:00::`, `incline%2:38:01::`
- **English Definitions**:
  1. *"have a tendency or disposition to do or be something; be inclined"*
  2. *"bend or turn (one's ear) towards a speaker in order to listen well"*
  3. *"lower or bend (the head or upper body), as in a nod or bow"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `傾斜 (義項 1)` | `傾斜 (義項 2)` | `傾斜 (義項 3)`

---

### 30. `intimacy` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `親密`
- **Source Sense IDs**: `intimacy%1:07:02::`, `intimacy%1:26:00::`, `intimacy%1:12:00::`
- **English Definitions**:
  1. *"close or warm friendship"*
  2. *"a usually secretive or illicit sexual relationship"*
  3. *"a feeling of being intimate and belonging together"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, transport, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `親密 (義項 1)` | `親密 (義項 2)` | `親密 (義項 3)`

---

### 31. `lease` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `租約`
- **Source Sense IDs**: `lease%1:21:00::`, `lease%1:10:00::`, `lease%1:28:00::`
- **English Definitions**:
  1. *"property that is leased or rented out or let"*
  2. *"a contract granting use or occupation of property during a specified time for a specified payment"*
  3. *"the period of time during which a contract conveying property to a person is in effect"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, finance, legal, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `租約 (義項 1)` | `租約 (義項 2)` | `租約 (義項 3)`

---

### 32. `lieutenant` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `中尉`
- **Source Sense IDs**: `lieutenant%1:18:01::`, `lieutenant%1:18:00::`, `lieutenant%1:18:02::`
- **English Definitions**:
  1. *"a commissioned military officer"*
  2. *"an officer in a police force"*
  3. *"an assistant with power to act when their superior is absent"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, legal). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `中尉 (義項 1)` | `中尉 (義項 2)` | `中尉 (義項 3)`

---

### 33. `lure` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `餌`
- **Source Sense IDs**: `lure%1:07:00::`, `lure%1:09:00::`, `lure%1:06:00::`
- **English Definitions**:
  1. *"qualities that attract by seeming to promise some kind of reward"*
  2. *"anything that serves as an enticement"*
  3. *"something used to lure fish or other animals into danger so they can be trapped or killed"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, clothing, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `餌 (義項 1)` | `餌 (義項 2)` | `餌 (義項 3)`

---

### 34. `mar` (verb) - [POSSIBLE_OVER_MERGE]
- **Current Chinese Meaning**: `損毀`
- **Source Sense IDs**: `mar%2:30:00::`, `mar%2:29:00::`
- **English Definitions**:
  1. *"make imperfect"*
  2. *"destroy or injure severely"*
- **Audit Explanation**: English definitions convey distinct usages or core actions (create vs destroy). High-school learners may benefit from separate entries or qualifiers.
- **Suggested Differentiated Meanings**: `損毀 (義項 1)` | `損毀 (義項 2)`

---

### 35. `martial` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `戰爭的`
- **Source Sense IDs**: `martial%5:00:02:military:02`, `martial%5:00:00:military:02`, `martial%5:00:00:military:01`
- **English Definitions**:
  1. *"(of persons) befitting a warrior"*
  2. *"suggesting war or military life"*
  3. *"of or relating to the armed forces"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `戰爭的 (義項 1)` | `戰爭的 (義項 2)` | `戰爭的 (義項 3)`

