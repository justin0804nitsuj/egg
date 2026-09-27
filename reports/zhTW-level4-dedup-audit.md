# Level 4 Traditional Chinese Learner-Meaning Deduplication Audit Report

This report presents a thorough linguistic audit of all **960** merged duplicate sense groups in Level 4 vocabulary.

---

## 1. Summary Statistics

| Metric | Count | Percentage |
| :--- | :---: | :---: |
| **Total Merged Groups Audited** | **960** | 100% |
| **SAFE_DUPLICATE** (Valid mergers) | **869** | 90.5% |
| **POSSIBLE_OVER_MERGE** (Nuanced / distinct usage) | **2** | 0.2% |
| **CLEAR_OVER_MERGE** (Must be separated) | **89** | 9.3% |
| **Total Affected Words** | **812** | - |

---

## 2. Top Words Needing Review

These words contain questionable mergers where distinct concepts were collapsed under identical Chinese translations:

1. **campaign** (2 questionable groups)
2. **defeat** (2 questionable groups)
3. **retreat** (2 questionable groups)
4. **aggressive** (1 questionable group)
5. **alert** (1 questionable group)
6. **anxiety** (1 questionable group)
7. **arms** (1 questionable group)
8. **atomic** (1 questionable group)
9. **battery** (1 questionable group)
10. **behavior** (1 questionable group)
11. **bond** (1 questionable group)
12. **bounce** (1 questionable group)
13. **calculation** (1 questionable group)
14. **calorie** (1 questionable group)
15. **capital(ism)** (1 questionable group)
16. **carrier** (1 questionable group)
17. **charity** (1 questionable group)
18. **collapse** (1 questionable group)
19. **commander** (1 questionable group)
20. **competitive** (1 questionable group)

---

## 3. Questionable Over-Merge Examples & Audit Detail

### 1. `aggressive` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `侵略的`
- **Source Sense IDs**: `aggressive%3:00:00::`, `aggressive%5:00:00:invasive:00`, `aggressive%5:00:00:hostile:01`
- **English Definitions**:
  1. *"having or showing determination and energetic pursuit of your ends"*
  2. *"tending to spread quickly"*
  3. *"characteristic of an enemy or one eager to fight"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `侵略的 (義項 1)` | `侵略的 (義項 2)` | `侵略的 (義項 3)`

---

### 2. `alert` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `警覺的`
- **Source Sense IDs**: `alert%1:26:00::`, `alert%1:10:00::`
- **English Definitions**:
  1. *"condition of heightened watchfulness or preparation for action"*
  2. *"a warning serves to make you more alert to danger"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (mathematics, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `警覺的 (義項 1)` | `警覺的 (義項 2)`

---

### 3. `anxiety` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `焦慮`
- **Source Sense IDs**: `anxiety%1:26:00::`, `anxiety%1:12:00::`
- **English Definitions**:
  1. *"(psychiatry) a relatively permanent state of worry and nervousness occurring in a variety of mental disorders, usually accompanied by compulsive behavior or attacks of panic"*
  2. *"a vague unpleasant emotion that is experienced in anticipation of some (usually ill-defined) misfortune"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, finance, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `焦慮 (義項 1)` | `焦慮 (義項 2)`

---

### 4. `arms` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `武器`
- **Source Sense IDs**: `arms%1:06:00::`, `arms%1:06:01::`
- **English Definitions**:
  1. *"weapons considered collectively"*
  2. *"the official symbols of a family, state, etc."*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `武器 (義項 1)` | `武器 (義項 2)`

---

### 5. `atomic` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `原子的`
- **Source Sense IDs**: `atomic%3:01:00::`, `atomic%3:00:00::`, `atomic%5:00:00:small:00`
- **English Definitions**:
  1. *"of or relating to or comprising atoms"*
  2. *"(weapons) deriving destructive energy from the release of atomic energy"*
  3. *"immeasurably small"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `原子的 (義項 1)` | `原子的 (義項 2)` | `原子的 (義項 3)`

---

### 6. `battery` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `電池`
- **Source Sense IDs**: `battery%1:14:02::`, `battery%1:06:00::`, `battery%1:14:01::`
- **English Definitions**:
  1. *"group of guns or missile launchers operated together at one place"*
  2. *"a device that produces electricity; may have several primary or secondary cells arranged in parallel or series"*
  3. *"a collection of related things intended for use together"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, military, time_season, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `電池 (義項 1)` | `電池 (義項 2)` | `電池 (義項 3)`

---

### 7. `behavior` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `行為`
- **Source Sense IDs**: `behavior%1:04:00::`, `behavior%1:26:00::`, `behavior%1:07:00::`
- **English Definitions**:
  1. *"manner of acting or controlling yourself"*
  2. *"the action or reaction of something (as a machine or substance) under specified circumstances"*
  3. *"(behavioral attributes) the way a person behaves toward other people"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `行為 (義項 1)` | `行為 (義項 2)` | `行為 (義項 3)`

---

### 8. `bond` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `捆綁物`
- **Source Sense IDs**: `bond%1:19:00::`, `bond%1:21:02::`, `bond%1:24:00::`
- **English Definitions**:
  1. *"an electrical force linking atoms"*
  2. *"a certificate of debt (usually interest-bearing or discounted) that is issued by a government or corporation in order to raise money; the issuer is required to pay a fixed sum annually until maturity and then a fixed sum to repay the principal"*
  3. *"a connection based on kinship or marriage or common interest"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, clothing, mathematics, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `捆綁物 (義項 1)` | `捆綁物 (義項 2)` | `捆綁物 (義項 3)`

---

### 9. `bounce` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `跳`
- **Source Sense IDs**: `bounce%1:07:00::`, `bounce%1:04:00::`, `bounce%1:11:00::`
- **English Definitions**:
  1. *"the quality of a substance that is able to rebound"*
  2. *"a light, self-propelled movement upwards or forwards"*
  3. *"rebounding from an impact (or series of impacts)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `跳 (義項 1)` | `跳 (義項 2)` | `跳 (義項 3)`

---

### 10. `calculation` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `計算`
- **Source Sense IDs**: `calculation%1:04:00::`, `calculation%1:09:00::`, `calculation%1:09:01::`
- **English Definitions**:
  1. *"the procedure of calculating; determining something by mathematical or logical methods"*
  2. *"problem solving that involves numbers or quantities"*
  3. *"planning something carefully and intentionally"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, mathematics, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `計算 (義項 1)` | `計算 (義項 2)` | `計算 (義項 3)`

---

### 11. `calorie` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `卡路裡（熱量單位）`
- **Source Sense IDs**: `calorie%1:23:01::`, `calorie%1:23:02::`
- **English Definitions**:
  1. *"unit of heat defined as the quantity of heat required to raise the temperature of 1 gram of water by 1 degree centigrade at atmospheric pressure"*
  2. *"a unit of heat equal to the amount of heat required to raise the temperature of one kilogram of water by one degree at one atmosphere pressure; used by nutritionists to characterize the energy-producing potential in food"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `卡路裡（熱量單位） (義項 1)` | `卡路裡（熱量單位） (義項 2)`

---

### 12. `campaign` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `戰役`
- **Source Sense IDs**: `campaign%1:11:00::`, `campaign%1:04:02::`, `campaign%1:04:00::`
- **English Definitions**:
  1. *"a race between candidates for elective office"*
  2. *"a series of actions advancing a principle or tending toward a particular end"*
  3. *"several related operations aimed at achieving a particular goal (usually within geographical and temporal constraints)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, military, entertainment, transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `戰役 (義項 1)` | `戰役 (義項 2)` | `戰役 (義項 3)`

---

### 13. `campaign` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `戰役`
- **Source Sense IDs**: `campaign%2:33:01::`, `campaign%2:41:10::`, `campaign%2:33:00::`
- **English Definitions**:
  1. *"run, stand, or compete for an office or a position"*
  2. *"exert oneself continuously, vigorously, or obtrusively to gain an end or engage in a crusade for a certain cause or person; be an advocate for"*
  3. *"go on a campaign; go off to war"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `戰役 (義項 1)` | `戰役 (義項 2)` | `戰役 (義項 3)`

---

### 14. `capital(ism)` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `首都`
- **Source Sense IDs**: `capital%1:21:01::`, `capital%1:21:00::`, `capital%1:15:00::`
- **English Definitions**:
  1. *"assets available for use in the production of further assets"*
  2. *"wealth in the form of money or property owned by a person or business and human resources of economic value"*
  3. *"a seat of government"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, transport, geography). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `首都 (義項 1)` | `首都 (義項 2)` | `首都 (義項 3)`

---

### 15. `carrier` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `運送者`
- **Source Sense IDs**: `carrier%1:06:03::`, `carrier%1:06:01::`
- **English Definitions**:
  1. *"a self-propelled wheeled vehicle designed specifically to carry something"*
  2. *"a large warship that carries planes and has a long flat deck for takeoffs and landings"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (transport, geography, military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `運送者 (義項 1)` | `運送者 (義項 2)`

---

### 16. `charity` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `慈悲`
- **Source Sense IDs**: `charity%1:14:00::`, `charity%1:07:00::`, `charity%1:04:00::`
- **English Definitions**:
  1. *"a foundation created to promote the public good (not for assistance to any particular individuals)"*
  2. *"a kindly and lenient attitude toward people"*
  3. *"an activity or gift that benefits the public at large"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `慈悲 (義項 1)` | `慈悲 (義項 2)` | `慈悲 (義項 3)`

---

### 17. `collapse` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `崩潰`
- **Source Sense IDs**: `collapse%2:38:00::`, `collapse%2:29:00::`, `collapse%2:38:01::`
- **English Definitions**:
  1. *"break down, literally or metaphorically"*
  2. *"collapse due to fatigue, an illness, or a sudden attack"*
  3. *"fold or close up"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (physical_shatter, military, medical). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `崩潰 (義項 1)` | `崩潰 (義項 2)` | `崩潰 (義項 3)`

---

### 18. `commander` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `司令官`
- **Source Sense IDs**: `commander%1:18:00::`, `commander%1:18:03::`, `commander%1:18:01::`
- **English Definitions**:
  1. *"an officer in command of a military unit"*
  2. *"someone in an official position of authority who can command or control others"*
  3. *"a commissioned naval officer who ranks above a lieutenant commander and below a captain"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `司令官 (義項 1)` | `司令官 (義項 2)` | `司令官 (義項 3)`

---

### 19. `competitive` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `競爭的`
- **Source Sense IDs**: `competitive%3:00:00::`, `competitive%5:00:00:capitalistic:00`, `competitive%5:00:00:aggressive:00`
- **English Definitions**:
  1. *"involving competition or competitiveness"*
  2. *"subscribing to capitalistic competition"*
  3. *"showing a fighting disposition"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, container, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `競爭的 (義項 1)` | `競爭的 (義項 2)` | `競爭的 (義項 3)`

---

### 20. `conventional` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `傳統的`
- **Source Sense IDs**: `conventional%3:00:00::`, `conventional%5:00:00:orthodox:00`, `conventional%3:00:02::`
- **English Definitions**:
  1. *"following accepted customs and proprieties"*
  2. *"conforming with accepted standards"*
  3. *"(weapons) using energy for propulsion or destruction that is not nuclear energy"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `傳統的 (義項 1)` | `傳統的 (義項 2)` | `傳統的 (義項 3)`

---

### 21. `counter` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `計算器`
- **Source Sense IDs**: `counter%1:06:00::`, `counter%1:06:03::`, `counter%1:06:01::`
- **English Definitions**:
  1. *"table consisting of a horizontal surface over which business is transacted"*
  2. *"game equipment (as a piece of wood, plastic, or ivory) used for keeping a count or reserving a space in various card or board games"*
  3. *"a calculator that keeps a record of the number of times something happens"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (transport, clothing, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `計算器 (義項 1)` | `計算器 (義項 2)` | `計算器 (義項 3)`

---

### 22. `decoration` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `裝飾`
- **Source Sense IDs**: `decoration%1:06:00::`, `decoration%1:10:00::`, `decoration%1:04:00::`
- **English Definitions**:
  1. *"something used to beautify"*
  2. *"an award for winning a championship or commemorating some other event"*
  3. *"the act of decorating something (in the hope of making it more attractive)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `裝飾 (義項 1)` | `裝飾 (義項 2)` | `裝飾 (義項 3)`

---

### 23. `defeat` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `敗北`
- **Source Sense IDs**: `defeat%1:11:00::`, `defeat%1:12:00::`
- **English Definitions**:
  1. *"an unsuccessful ending to a struggle or contest"*
  2. *"the feeling that accompanies an experience of being thwarted in attaining your goals"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `敗北 (義項 1)` | `敗北 (義項 2)`

---

### 24. `defeat` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `敗北`
- **Source Sense IDs**: `defeat%2:33:00::`, `defeat%2:41:00::`
- **English Definitions**:
  1. *"win a victory over"*
  2. *"thwart the passage of"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `敗北 (義項 1)` | `敗北 (義項 2)`

---

### 25. `defend` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `防護`
- **Source Sense IDs**: `defend%2:32:00::`, `defend%2:33:00::`, `defend%2:33:02::`
- **English Definitions**:
  1. *"argue or speak in defense of"*
  2. *"be on the defensive; act against an attack"*
  3. *"protect against a challenge or attack"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `防護 (義項 1)` | `防護 (義項 2)` | `防護 (義項 3)`

---

### 26. `defense` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `防衛`
- **Source Sense IDs**: `defense%1:04:00::`, `defense%1:04:03::`, `defense%1:14:01::`
- **English Definitions**:
  1. *"(military) military action or resources protecting a country against potential enemies"*
  2. *"protection from harm"*
  3. *"(sports) the team that is trying to prevent the other team from scoring"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, container, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `防衛 (義項 1)` | `防衛 (義項 2)` | `防衛 (義項 3)`

---

### 27. `defensive` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `防衛的`
- **Source Sense IDs**: `defensive%3:00:00::`, `defensive%5:00:00:apologetic:00`
- **English Definitions**:
  1. *"intended or appropriate for defending against or deterring aggression or attack"*
  2. *"attempting to justify or defend in speech or writing"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `防衛的 (義項 1)` | `防衛的 (義項 2)`

---

### 28. `delicate` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `細致優雅的`
- **Source Sense IDs**: `delicate%3:00:00::`, `delicate%5:00:00:skilled:00`, `delicate%5:00:00:breakable:00`
- **English Definitions**:
  1. *"exquisitely fine and subtle and pleasing; susceptible to injury"*
  2. *"marked by great skill especially in meticulous technique"*
  3. *"easily broken or damaged or destroyed"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, legal, entertainment, physical_shatter). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `細致優雅的 (義項 1)` | `細致優雅的 (義項 2)` | `細致優雅的 (義項 3)`

---

### 29. `demonstration` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `示範`
- **Source Sense IDs**: `demonstration%1:04:00::`, `demonstration%1:04:02::`, `demonstration%1:04:01::`
- **English Definitions**:
  1. *"a show or display; the act of presenting something to sight or view"*
  2. *"a show of military force or preparedness"*
  3. *"a public display of group feelings (usually of a political nature)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, military, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `示範 (義項 1)` | `示範 (義項 2)` | `示範 (義項 3)`

---

### 30. `disguise` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `假面目`
- **Source Sense IDs**: `disguise%1:07:00::`, `disguise%1:06:00::`, `disguise%1:04:00::`
- **English Definitions**:
  1. *"an outward semblance that misrepresents the true nature of something"*
  2. *"any attire that modifies the appearance in order to conceal the wearer's identity"*
  3. *"the act of concealing the identity of something by modifying its appearance"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `假面目 (義項 1)` | `假面目 (義項 2)` | `假面目 (義項 3)`

---

### 31. `dodge` (verb) - [POSSIBLE_OVER_MERGE]
- **Current Chinese Meaning**: `避開`
- **Source Sense IDs**: `dodge%2:38:00::`, `dodge%2:38:01::`, `dodge%2:32:00::`
- **English Definitions**:
  1. *"make a sudden movement in a new direction so as to avoid"*
  2. *"move to and fro or from place to place usually in an irregular course"*
  3. *"avoid or try to avoid fulfilling, answering, or performing (duties, questions, or issues)"*
- **Audit Explanation**: English definitions convey distinct usages or core actions (create vs move). High-school learners may benefit from separate entries or qualifiers.
- **Suggested Differentiated Meanings**: `避開 (義項 1)` | `避開 (義項 2)` | `避開 (義項 3)`

---

### 32. `draft` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `氣流`
- **Source Sense IDs**: `draft%2:36:00::`, `draft%2:33:00::`, `draft%2:36:05::`
- **English Definitions**:
  1. *"draw up an outline or sketch for something"*
  2. *"engage somebody to enter the army"*
  3. *"make a blueprint of"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `氣流 (義項 1)` | `氣流 (義項 2)` | `氣流 (義項 3)`

---

### 33. `drill` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `鑽孔機`
- **Source Sense IDs**: `drill%2:35:00::`, `drill%2:31:03::`, `drill%2:31:00::`
- **English Definitions**:
  1. *"make a hole, especially with a pointed power or hand tool"*
  2. *"train in the military, e.g., in the use of weapons"*
  3. *"learn by repetition"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `鑽孔機 (義項 1)` | `鑽孔機 (義項 2)` | `鑽孔機 (義項 3)`

---

### 34. `encounter` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `相會`
- **Source Sense IDs**: `encounter%1:04:00::`, `encounter%1:11:00::`, `encounter%1:04:01::`
- **English Definitions**:
  1. *"a minor short-term fight"*
  2. *"a casual or unexpected convergence"*
  3. *"a casual meeting with a person or thing"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `相會 (義項 1)` | `相會 (義項 2)` | `相會 (義項 3)`

---

### 35. `flush` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `流溢`
- **Source Sense IDs**: `flush%2:29:00::`, `flush%2:30:00::`, `flush%2:39:00::`
- **English Definitions**:
  1. *"turn red, as if in embarrassment or shame"*
  2. *"cause to flow through something"*
  3. *"glow or cause to glow with warm color or light"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `流溢 (義項 1)` | `流溢 (義項 2)` | `流溢 (義項 3)`

