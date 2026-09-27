# Level 1 Traditional Chinese Learner-Meaning Deduplication Audit Report

This report presents a thorough linguistic audit of all **1035** merged duplicate sense groups in Level 1 vocabulary.

---

## 1. Summary Statistics

| Metric | Count | Percentage |
| :--- | :---: | :---: |
| **Total Merged Groups Audited** | **1035** | 100% |
| **SAFE_DUPLICATE** (Valid mergers) | **986** | 95.3% |
| **POSSIBLE_OVER_MERGE** (Nuanced / distinct usage) | **3** | 0.3% |
| **CLEAR_OVER_MERGE** (Must be separated) | **46** | 4.4% |
| **Total Affected Words** | **778** | - |

---

## 2. Top Words Needing Review

These words contain questionable mergers where distinct concepts were collapsed under identical Chinese translations:

1. **pass** (2 questionable groups)
2. **pull** (2 questionable groups)
3. **rise** (2 questionable groups)
4. **fly** (1 questionable group)
5. **north** (1 questionable group)
6. **nose** (1 questionable group)
7. **nurse** (1 questionable group)
8. **on** (1 questionable group)
9. **open** (1 questionable group)
10. **order** (1 questionable group)
11. **pay(ment)** (1 questionable group)
12. **plant** (1 questionable group)
13. **pool** (1 questionable group)
14. **pot** (1 questionable group)
15. **practice** (1 questionable group)
16. **push** (1 questionable group)
17. **race** (1 questionable group)
18. **raise** (1 questionable group)
19. **reach** (1 questionable group)
20. **report** (1 questionable group)

---

## 3. Questionable Over-Merge Examples & Audit Detail

### 1. `fly` (verb) - [POSSIBLE_OVER_MERGE]
- **Current Chinese Meaning**: `蒼蠅`
- **Source Sense IDs**: `fly%2:38:00::`, `fly%2:38:02::`, `fly%2:38:01::`
- **English Definitions**:
  1. *"travel through the air; be airborne"*
  2. *"move quickly or suddenly"*
  3. *"operate an airplane"*
- **Audit Explanation**: English definitions convey distinct usages or core actions (move vs operate). High-school learners may benefit from separate entries or qualifiers.
- **Suggested Differentiated Meanings**: `蒼蠅 (義項 1)` | `蒼蠅 (義項 2)` | `蒼蠅 (義項 3)`

---

### 2. `north` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `正北；北方`
- **Source Sense IDs**: `north%1:24:00::`, `north%1:24:02::`
- **English Definitions**:
  1. *"the cardinal compass point that is at 0 or 360 degrees"*
  2. *"the direction corresponding to the northward cardinal compass point"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, transport, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `正北；北方 (義項 1)` | `正北；北方 (義項 2)`

---

### 3. `nose` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `鼻子`
- **Source Sense IDs**: `nose%1:08:00::`, `nose%1:06:00::`, `nose%1:06:02::`
- **English Definitions**:
  1. *"the organ of smell and entrance to the respiratory tract; the prominent part of the face of man or other mammals"*
  2. *"a front that resembles a human nose (especially the front of an aircraft)"*
  3. *"the front or forward projection of a tool or weapon"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, transport, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `鼻子 (義項 1)` | `鼻子 (義項 2)` | `鼻子 (義項 3)`

---

### 4. `nurse` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `護士`
- **Source Sense IDs**: `nurse%2:29:00::`, `nurse%2:37:00::`, `nurse%2:41:00::`
- **English Definitions**:
  1. *"try to cure by special care of treatment, of an illness or injury"*
  2. *"maintain (a theory, thoughts, or feelings)"*
  3. *"serve as a nurse; care for sick or handicapped people"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (legal, transport, medical, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `護士 (義項 1)` | `護士 (義項 2)` | `護士 (義項 3)`

---

### 5. `on` (adverb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `在...之上`
- **Source Sense IDs**: `on%4:02:00::`, `on%4:02:01::`, `on%4:02:02::`
- **English Definitions**:
  1. *"with a forward motion"*
  2. *"indicates continuity or persistence or concentration"*
  3. *"in a state required for something to function or be effective"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `在...之上 (義項 1)` | `在...之上 (義項 2)` | `在...之上 (義項 3)`

---

### 6. `open` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `公開`
- **Source Sense IDs**: `open%3:00:01::`, `open%3:00:02::`, `open%5:00:00:unprotected:00`
- **English Definitions**:
  1. *"affording unobstructed entrance and exit; not shut or closed"*
  2. *"affording free passage or access"*
  3. *"with no protection or shield"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `公開 (義項 1)` | `公開 (義項 2)` | `公開 (義項 3)`

---

### 7. `order` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `次序`
- **Source Sense IDs**: `order%1:10:03::`, `order%1:07:01::`, `order%1:26:00::`
- **English Definitions**:
  1. *"(often plural) a command given by a superior (e.g., a military or law enforcement officer) that must be obeyed"*
  2. *"a degree in a continuum of size or quantity"*
  3. *"established customary state (especially of society)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (legal, military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `次序 (義項 1)` | `次序 (義項 2)` | `次序 (義項 3)`

---

### 8. `pass` (verb) - [POSSIBLE_OVER_MERGE]
- **Current Chinese Meaning**: `經過`
- **Source Sense IDs**: `pass%2:38:00::`, `pass%2:38:05::`, `pass%2:41:02::`
- **English Definitions**:
  1. *"go across or through"*
  2. *"move past"*
  3. *"make laws, bills, etc. or bring into effect by legislation"*
- **Audit Explanation**: English definitions convey distinct usages or core actions (move vs create). High-school learners may benefit from separate entries or qualifiers.
- **Suggested Differentiated Meanings**: `經過 (義項 1)` | `經過 (義項 2)` | `經過 (義項 3)`

---

### 9. `pass` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `經過`
- **Source Sense IDs**: `pass%1:04:04::`, `pass%1:28:00::`, `pass%1:04:02::`
- **English Definitions**:
  1. *"(baseball) an advance to first base by a batter who receives four balls"*
  2. *"(military) a written leave of absence"*
  3. *"(American football) a play that involves one player throwing the ball to a teammate"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, entertainment, container, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `經過 (義項 1)` | `經過 (義項 2)` | `經過 (義項 3)`

---

### 10. `pay(ment)` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `付錢`
- **Source Sense IDs**: `pay%2:40:00::`, `pay%2:32:00::`, `pay%2:40:04::`
- **English Definitions**:
  1. *"give money, usually in exchange for goods or services"*
  2. *"convey, as of a compliment, regards, attention, etc.; bestow"*
  3. *"cancel or discharge a debt"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `付錢 (義項 1)` | `付錢 (義項 2)` | `付錢 (義項 3)`

---

### 11. `plant` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `植物`
- **Source Sense IDs**: `plant%1:06:01::`, `plant%1:03:00::`, `plant%1:18:00::`
- **English Definitions**:
  1. *"buildings for carrying on industrial labor"*
  2. *"(botany) a living organism lacking the power of locomotion"*
  3. *"an actor situated in the audience whose acting is rehearsed but seems spontaneous to the audience"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (legal, transport, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `植物 (義項 1)` | `植物 (義項 2)` | `植物 (義項 3)`

---

### 12. `pool` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `池`
- **Source Sense IDs**: `pool%2:40:00::`, `pool%2:33:00::`
- **English Definitions**:
  1. *"combine into a common fund"*
  2. *"join or form a pool of people"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `池 (義項 1)` | `池 (義項 2)`

---

### 13. `pot` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `盆`
- **Source Sense IDs**: `pot%1:06:00::`, `pot%1:06:01::`, `pot%1:23:00::`
- **English Definitions**:
  1. *"metal or earthenware cooking vessel that is usually round and deep; often has a handle and lid"*
  2. *"a plumbing fixture for defecation and urination"*
  3. *"the quantity contained in a pot"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, container, clothing, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `盆 (義項 1)` | `盆 (義項 2)` | `盆 (義項 3)`

---

### 14. `practice` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `實踐`
- **Source Sense IDs**: `practice%1:04:00::`, `practice%1:04:02::`, `practice%1:04:04::`
- **English Definitions**:
  1. *"a customary way of operation or behavior"*
  2. *"systematic training by multiple repetitions"*
  3. *"translating an idea into action"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, mathematics, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `實踐 (義項 1)` | `實踐 (義項 2)` | `實踐 (義項 3)`

---

### 15. `pull` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `拉`
- **Source Sense IDs**: `pull%2:35:00::`, `pull%2:35:02::`, `pull%2:38:01::`
- **English Definitions**:
  1. *"cause to move by pulling"*
  2. *"direct toward itself or oneself by means of some psychological power or physical attributes"*
  3. *"move into a certain direction"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `拉 (義項 1)` | `拉 (義項 2)` | `拉 (義項 3)`

---

### 16. `pull` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `拉`
- **Source Sense IDs**: `pull%1:04:00::`, `pull%1:19:00::`, `pull%1:07:00::`
- **English Definitions**:
  1. *"the act of pulling; applying force to move something toward or with you"*
  2. *"the force used in pulling"*
  3. *"special advantage or influence"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `拉 (義項 1)` | `拉 (義項 2)` | `拉 (義項 3)`

---

### 17. `push` (verb) - [POSSIBLE_OVER_MERGE]
- **Current Chinese Meaning**: `推`
- **Source Sense IDs**: `push%2:38:00::`, `push%2:32:01::`, `push%2:32:00::`
- **English Definitions**:
  1. *"move with force"*
  2. *"press, drive, or impel (someone) to action or completion of an action"*
  3. *"make publicity for; try to sell (a product)"*
- **Audit Explanation**: English definitions convey distinct usages or core actions (move vs create). High-school learners may benefit from separate entries or qualifiers.
- **Suggested Differentiated Meanings**: `推 (義項 1)` | `推 (義項 2)` | `推 (義項 3)`

---

### 18. `race` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `種族`
- **Source Sense IDs**: `race%2:38:00::`, `race%2:33:00::`, `race%2:41:03::`
- **English Definitions**:
  1. *"move hurridly"*
  2. *"compete in a race"*
  3. *"to work as fast as possible towards a goal, sometimes in competition with others"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `種族 (義項 1)` | `種族 (義項 2)` | `種族 (義項 3)`

---

### 19. `raise` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `上升`
- **Source Sense IDs**: `raise%1:07:00::`, `raise%1:17:00::`, `raise%1:04:01::`
- **English Definitions**:
  1. *"the amount a salary is increased"*
  2. *"an upward slope or grade (as in a road)"*
  3. *"increasing the size of a bet (as in poker)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (geography, military, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `上升 (義項 1)` | `上升 (義項 2)` | `上升 (義項 3)`

---

### 20. `reach` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `伸出`
- **Source Sense IDs**: `reach%2:38:01::`, `reach%2:38:00::`, `reach%2:35:00::`
- **English Definitions**:
  1. *"reach a destination, either real or abstract"*
  2. *"reach a point in time, or a certain state or level"*
  3. *"move forward or upward in order to touch; also in a metaphorical sense"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `伸出 (義項 1)` | `伸出 (義項 2)` | `伸出 (義項 3)`

---

### 21. `report` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `報告`
- **Source Sense IDs**: `report%1:10:03::`, `report%1:10:01::`, `report%1:10:00::`
- **English Definitions**:
  1. *"a written document describing the findings of some individual or group"*
  2. *"the act of informing by verbal report"*
  3. *"a short account of the news"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `報告 (義項 1)` | `報告 (義項 2)` | `報告 (義項 3)`

---

### 22. `right` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `右邊；正確的；權利`
- **Source Sense IDs**: `right%3:00:00::`, `right%3:00:02::`, `right%5:00:01:proper:00`
- **English Definitions**:
  1. *"being or located on or directed toward the side of the body to the east when facing north"*
  2. *"free from error; especially conforming to fact or truth"*
  3. *"socially right or correct"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `右邊；正確的；權利 (義項 1)` | `右邊；正確的；權利 (義項 2)` | `右邊；正確的；權利 (義項 3)`

---

### 23. `rise` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `上升`
- **Source Sense IDs**: `rise%1:11:00::`, `rise%1:04:00::`, `rise%1:17:00::`
- **English Definitions**:
  1. *"a growth in strength or number or importance"*
  2. *"the act of changing location in an upward direction"*
  3. *"an upward slope or grade (as in a road)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (mathematics, military, geography). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `上升 (義項 1)` | `上升 (義項 2)` | `上升 (義項 3)`

---

### 24. `rise` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `上升`
- **Source Sense IDs**: `rise%2:38:00::`, `rise%2:30:00::`, `rise%2:38:05::`
- **English Definitions**:
  1. *"move upward"*
  2. *"increase in value or to a higher point"*
  3. *"rise to one's feet"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `上升 (義項 1)` | `上升 (義項 2)` | `上升 (義項 3)`

---

### 25. `roll` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `卷`
- **Source Sense IDs**: `roll%1:11:02::`, `roll%1:10:00::`, `roll%1:11:01::`
- **English Definitions**:
  1. *"rotary motion of an object around its own axis"*
  2. *"a list of names"*
  3. *"a long heavy sea wave as it advances towards the shore"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (geography, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `卷 (義項 1)` | `卷 (義項 2)` | `卷 (義項 3)`

---

### 26. `round` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `圓`
- **Source Sense IDs**: `round%1:06:01::`, `round%1:28:01::`, `round%1:15:00::`
- **English Definitions**:
  1. *"a charge of ammunition for a single shot"*
  2. *"an interval during which a recurring sequence of events occurs"*
  3. *"a regular route for a sentry or policeman"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, legal). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `圓 (義項 1)` | `圓 (義項 2)` | `圓 (義項 3)`

---

### 27. `service` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `服務`
- **Source Sense IDs**: `service%1:04:08::`, `service%1:04:00::`, `service%1:04:01::`
- **English Definitions**:
  1. *"work done by one person or group that benefits another"*
  2. *"an act of help or assistance; something (such as a tool, software or system) used to render said help or assistance"*
  3. *"the act of public worship following prescribed rules"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, military, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `服務 (義項 1)` | `服務 (義項 2)` | `服務 (義項 3)`

---

### 28. `share` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `部分`
- **Source Sense IDs**: `share%1:21:00::`, `share%1:21:01::`, `share%1:04:00::`
- **English Definitions**:
  1. *"assets belonging to or due to or contributed by an individual person or group"*
  2. *"any of the equal portions into which the capital stock of a corporation is divided and ownership of which is evidenced by a stock certificate"*
  3. *"the allotment of some amount by dividing something"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `部分 (義項 1)` | `部分 (義項 2)` | `部分 (義項 3)`

---

### 29. `sick` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `病人`
- **Source Sense IDs**: `sick%3:00:01::`, `sick%5:00:02:ill:01`, `sick%5:00:00:insane:00`
- **English Definitions**:
  1. *"affected by an impairment of normal physical or mental function"*
  2. *"feeling nausea; feeling about to vomit"*
  3. *"affected with madness or insanity"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, geography). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `病人 (義項 1)` | `病人 (義項 2)` | `病人 (義項 3)`

---

### 30. `sight` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `景觀`
- **Source Sense IDs**: `sight%2:39:00::`, `sight%2:39:03::`
- **English Definitions**:
  1. *"catch sight of; to perceive with the eyes"*
  2. *"take aim by looking through the sights of a gun (or other device)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `景觀 (義項 1)` | `景觀 (義項 2)`

---

### 31. `soldier` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `軍人`
- **Source Sense IDs**: `soldier%1:18:00::`, `soldier%1:05:00::`
- **English Definitions**:
  1. *"an enlisted man or woman who serves in an army"*
  2. *"a wingless sterile ant or termite having a large head and powerful jaws adapted for defending the colony"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `軍人 (義項 1)` | `軍人 (義項 2)`

---

### 32. `south` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `南方`
- **Source Sense IDs**: `south%1:24:00::`, `south%1:15:02::`, `south%1:24:02::`
- **English Definitions**:
  1. *"the cardinal compass point that is at 180 degrees"*
  2. *"a location in the southern part of a country, region, or city"*
  3. *"the direction corresponding to the southward cardinal compass point"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, transport, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `南方 (義項 1)` | `南方 (義項 2)` | `南方 (義項 3)`

---

### 33. `spring` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `春天`
- **Source Sense IDs**: `spring%2:38:01::`, `spring%2:42:00::`, `spring%2:38:00::`
- **English Definitions**:
  1. *"move forward by leaps and bounds"*
  2. *"develop into a distinctive entity"*
  3. *"spring back; spring away from an impact"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, time_season). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `春天 (義項 1)` | `春天 (義項 2)` | `春天 (義項 3)`

---

### 34. `square` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `正方形`
- **Source Sense IDs**: `square%1:25:00::`, `square%1:23:00::`, `square%1:15:00::`
- **English Definitions**:
  1. *"(geometry) a plane rectangle with four equal sides and four right angles; a four-sided regular polygon"*
  2. *"the product of two equal terms"*
  3. *"an open area at the meeting of two or more streets"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `正方形 (義項 1)` | `正方形 (義項 2)` | `正方形 (義項 3)`

---

### 35. `study` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `學習`
- **Source Sense IDs**: `study%2:31:02::`, `study%2:31:03::`, `study%2:39:00::`
- **English Definitions**:
  1. *"consider in detail and subject to an analysis in order to discover essential features or meaning"*
  2. *"be a student; follow a course of study; be enrolled at an institute of learning"*
  3. *"give careful consideration to"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `學習 (義項 1)` | `學習 (義項 2)` | `學習 (義項 3)`

