# Level 5 Traditional Chinese Learner-Meaning Deduplication Audit Report

This report presents a thorough linguistic audit of all **951** merged duplicate sense groups in Level 5 vocabulary.

---

## 1. Summary Statistics

| Metric | Count | Percentage |
| :--- | :---: | :---: |
| **Total Merged Groups Audited** | **951** | 100% |
| **SAFE_DUPLICATE** (Valid mergers) | **850** | 89.4% |
| **POSSIBLE_OVER_MERGE** (Nuanced / distinct usage) | **1** | 0.1% |
| **CLEAR_OVER_MERGE** (Must be separated) | **100** | 10.5% |
| **Total Affected Words** | **797** | - |

---

## 2. Top Words Needing Review

These words contain questionable mergers where distinct concepts were collapsed under identical Chinese translations:

1. **assault** (2 questionable groups)
2. **decline** (2 questionable groups)
3. **marine** (2 questionable groups)
4. **raid** (2 questionable groups)
5. **recruit** (2 questionable groups)
6. **abuse** (1 questionable group)
7. **accounting** (1 questionable group)
8. **aggression** (1 questionable group)
9. **apt** (1 questionable group)
10. **assess(ment)** (1 questionable group)
11. **auction** (1 questionable group)
12. **bound** (1 questionable group)
13. **boxer** (1 questionable group)
14. **bully** (1 questionable group)
15. **canvas** (1 questionable group)
16. **caution** (1 questionable group)
17. **commitment** (1 questionable group)
18. **compassion** (1 questionable group)
19. **comprehend** (1 questionable group)
20. **conduct** (1 questionable group)

---

## 3. Questionable Over-Merge Examples & Audit Detail

### 1. `abuse` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `濫用`
- **Source Sense IDs**: `abuse%2:41:00::`, `abuse%2:30:00::`, `abuse%2:32:00::`
- **English Definitions**:
  1. *"treat badly"*
  2. *"change the inherent purpose or function of something"*
  3. *"use foul or abusive language towards"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `濫用 (義項 1)` | `濫用 (義項 2)` | `濫用 (義項 3)`

---

### 2. `accounting` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `會計學`
- **Source Sense IDs**: `accounting%1:10:00::`, `accounting%1:09:00::`, `accounting%1:04:00::`
- **English Definitions**:
  1. *"a convincing explanation that reveals basic causes"*
  2. *"a system that provides quantitative information about finances"*
  3. *"the occupation of maintaining and auditing records and preparing financial reports for a business"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, finance, container, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `會計學 (義項 1)` | `會計學 (義項 2)` | `會計學 (義項 3)`

---

### 3. `aggression` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `侵犯`
- **Source Sense IDs**: `aggression%1:07:00::`, `aggression%1:12:00::`, `aggression%1:04:00::`
- **English Definitions**:
  1. *"a disposition to behave aggressively"*
  2. *"a feeling of hostility that arouses thoughts of attack"*
  3. *"violent action that is hostile and usually unprovoked"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `侵犯 (義項 1)` | `侵犯 (義項 2)` | `侵犯 (義項 3)`

---

### 4. `apt` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `有...傾向的`
- **Source Sense IDs**: `apt%5:00:00:inclined:02`, `apt%5:00:00:likely:00`, `apt%5:00:00:intelligent:00`
- **English Definitions**:
  1. *"(usually followed by ‘to’) naturally disposed toward"*
  2. *"at risk of or subject to experiencing something usually unpleasant"*
  3. *"mentally quick and resourceful"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `有...傾向的 (義項 1)` | `有...傾向的 (義項 2)` | `有...傾向的 (義項 3)`

---

### 5. `assault` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `攻擊`
- **Source Sense IDs**: `assault%1:04:00::`, `assault%1:04:02::`
- **English Definitions**:
  1. *"close fighting during the culmination of a military attack"*
  2. *"the crime of forcing a person to submit to sexual intercourse against his or her will"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, legal). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `攻擊 (義項 1)` | `攻擊 (義項 2)`

---

### 6. `assault` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `攻擊`
- **Source Sense IDs**: `assault%2:33:00::`, `assault%2:41:03::`, `assault%2:32:00::`
- **English Definitions**:
  1. *"attack someone physically or emotionally"*
  2. *"force (someone) to have sex against their will"*
  3. *"attack in speech or writing"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `攻擊 (義項 1)` | `攻擊 (義項 2)` | `攻擊 (義項 3)`

---

### 7. `assess(ment)` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `評定`
- **Source Sense IDs**: `assess%2:31:00::`, `assess%2:40:01::`, `assess%2:40:00::`
- **English Definitions**:
  1. *"evaluate or estimate the nature, quality, ability, extent, or significance of"*
  2. *"charge (a person or a property) with a payment, such as a tax or a fine"*
  3. *"set or determine the amount of (a payment such as a fine)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `評定 (義項 1)` | `評定 (義項 2)` | `評定 (義項 3)`

---

### 8. `auction` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `拍賣`
- **Source Sense IDs**: `auction%1:04:01::`, `auction%1:04:00::`
- **English Definitions**:
  1. *"a variety of bridge in which tricks made in excess of the contract are scored toward game; now generally superseded by contract bridge"*
  2. *"the public sale of something to the highest bidder"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (legal, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `拍賣 (義項 1)` | `拍賣 (義項 2)`

---

### 9. `bound` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `躍`
- **Source Sense IDs**: `bound%2:38:01::`, `bound%2:42:00::`, `bound%2:30:00::`
- **English Definitions**:
  1. *"move forward by leaps and bounds"*
  2. *"form the boundary of; be contiguous to"*
  3. *"place limits on (extent or amount or access)"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `躍 (義項 1)` | `躍 (義項 2)` | `躍 (義項 3)`

---

### 10. `boxer` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `拳師`
- **Source Sense IDs**: `boxer%1:18:01::`, `boxer%1:05:00::`
- **English Definitions**:
  1. *"a workman employed to pack things into containers"*
  2. *"a breed of stocky medium-sized short-haired dog with a brindled coat and square-jawed muzzle developed in Germany"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, finance, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `拳師 (義項 1)` | `拳師 (義項 2)`

---

### 11. `bully` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `欺凌弱小者`
- **Source Sense IDs**: `bully%2:37:00::`, `bully%2:32:00::`
- **English Definitions**:
  1. *"be bossy towards"*
  2. *"discourage or frighten with threats or a domineering manner; intimidate"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `欺凌弱小者 (義項 1)` | `欺凌弱小者 (義項 2)`

---

### 12. `canvas` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `帆布`
- **Source Sense IDs**: `canvas%1:06:00::`, `canvas%1:06:04::`, `canvas%1:26:00::`
- **English Definitions**:
  1. *"a heavy, closely woven fabric"*
  2. *"an oil painting on canvas fabric"*
  3. *"the setting for a narrative or fictional or dramatic account"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, finance, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `帆布 (義項 1)` | `帆布 (義項 2)` | `帆布 (義項 3)`

---

### 13. `caution` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `小心`
- **Source Sense IDs**: `caution%1:07:00::`, `caution%1:10:00::`, `caution%1:09:00::`
- **English Definitions**:
  1. *"the trait of being cautious; being attentive to possible danger"*
  2. *"a warning against certain acts"*
  3. *"judiciousness in avoiding harm or danger"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `小心 (義項 1)` | `小心 (義項 2)` | `小心 (義項 3)`

---

### 14. `commitment` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `委托`
- **Source Sense IDs**: `commitment%1:07:01::`, `commitment%1:04:00::`, `commitment%1:04:02::`
- **English Definitions**:
  1. *"the trait of sincere and steadfast fixity of purpose"*
  2. *"the act of binding yourself (intellectually or emotionally) to a course of action"*
  3. *"an engagement by contract involving financial obligation"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (container, finance, legal, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `委托 (義項 1)` | `委托 (義項 2)` | `委托 (義項 3)`

---

### 15. `compassion` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `同情`
- **Source Sense IDs**: `compassion%1:12:00::`, `compassion%1:07:00::`
- **English Definitions**:
  1. *"a deep awareness of and sympathy for another's suffering"*
  2. *"the humane quality of understanding the suffering of others and wanting to do something about it"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `同情 (義項 1)` | `同情 (義項 2)`

---

### 16. `comprehend` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `理解`
- **Source Sense IDs**: `comprehend%2:31:00::`, `comprehend%2:39:00::`, `comprehend%2:42:00::`
- **English Definitions**:
  1. *"get the meaning of something"*
  2. *"to become aware of through the senses"*
  3. *"include in scope; include as part of something broader; have as one's sphere or territory"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `理解 (義項 1)` | `理解 (義項 2)` | `理解 (義項 3)`

---

### 17. `conduct` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `行為`
- **Source Sense IDs**: `conduct%1:04:00::`, `conduct%1:07:00::`
- **English Definitions**:
  1. *"manner of acting or controlling yourself"*
  2. *"(behavioral attributes) the way a person behaves toward other people"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `行為 (義項 1)` | `行為 (義項 2)`

---

### 18. `confession` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `承認`
- **Source Sense IDs**: `confession%1:10:00::`, `confession%1:10:01::`, `confession%1:04:00::`
- **English Definitions**:
  1. *"an admission of misdeeds or faults"*
  2. *"a written document acknowledging an offense and signed by the guilty party"*
  3. *"(Roman Catholic Church) the act of a penitent disclosing their sinfulness before a priest in the sacrament of penance in the hope of absolution"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (legal, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `承認 (義項 1)` | `承認 (義項 2)` | `承認 (義項 3)`

---

### 19. `constitutional` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `憲法的`
- **Source Sense IDs**: `constitutional%3:01:00::`, `constitutional%3:00:00::`, `constitutional%5:00:00:intrinsic:00`
- **English Definitions**:
  1. *"of benefit to or intended to benefit your physical makeup"*
  2. *"sanctioned by or consistent with or operating under the law determining the fundamental political principles of a government"*
  3. *"existing as an essential constituent or characteristic"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, legal, entertainment). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `憲法的 (義項 1)` | `憲法的 (義項 2)` | `憲法的 (義項 3)`

---

### 20. `continental` (adjective) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `大陸的`
- **Source Sense IDs**: `continental%3:01:02::`, `continental%3:01:00::`, `continental%3:00:00::`
- **English Definitions**:
  1. *"of or relating to or concerning the American colonies during and immediately after the American Revolutionary War"*
  2. *"of or relating to or characteristic of a continent"*
  3. *"being or concerning or limited to a continent especially the continents of North America or Europe"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, container). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `大陸的 (義項 1)` | `大陸的 (義項 2)` | `大陸的 (義項 3)`

---

### 21. `contractor` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `立契約的人`
- **Source Sense IDs**: `contractor%1:18:00::`, `contractor%1:18:02::`, `contractor%1:18:01::`
- **English Definitions**:
  1. *"someone (a person or firm) who contracts to build things"*
  2. *"the bridge player in contract bridge who wins the bidding and can declare which suit is to be trumps"*
  3. *"(law) a party to a contract"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (legal, entertainment, container, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `立契約的人 (義項 1)` | `立契約的人 (義項 2)` | `立契約的人 (義項 3)`

---

### 22. `corporation` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `公司`
- **Source Sense IDs**: `corporation%1:14:00::`, `corporation%1:08:00::`
- **English Definitions**:
  1. *"a business firm whose articles of incorporation have been approved in some state"*
  2. *"slang for a paunch"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `公司 (義項 1)` | `公司 (義項 2)`

---

### 23. `custody` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `監護`
- **Source Sense IDs**: `custody%1:26:00::`, `custody%1:04:01::`, `custody%1:04:02::`
- **English Definitions**:
  1. *"a state of being confined (usually for a short time)"*
  2. *"holding by the police"*
  3. *"(with ‘in’) guardianship over; in divorce cases it is the right to house and care for and discipline a child"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, legal, container, transport). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `監護 (義項 1)` | `監護 (義項 2)` | `監護 (義項 3)`

---

### 24. `declaration` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `宣告`
- **Source Sense IDs**: `declaration%1:10:00::`, `declaration%1:10:02::`, `declaration%1:10:06::`
- **English Definitions**:
  1. *"a statement that is emphatic and explicit (spoken or written)"*
  2. *"(law) unsworn statement that can be admitted in evidence in a legal transaction"*
  3. *"a statement of taxable goods or of dutiable properties"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (clothing, legal, container, finance). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `宣告 (義項 1)` | `宣告 (義項 2)` | `宣告 (義項 3)`

---

### 25. `decline` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `衰退`
- **Source Sense IDs**: `decline%1:22:02::`, `decline%1:26:00::`, `decline%1:22:01::`
- **English Definitions**:
  1. *"change toward something smaller or lower"*
  2. *"a condition inferior to an earlier condition; a gradual falling off from a better state; decline"*
  3. *"a gradual decrease; as of stored charge or current"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `衰退 (義項 1)` | `衰退 (義項 2)` | `衰退 (義項 3)`

---

### 26. `decline` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `衰退`
- **Source Sense IDs**: `decline%2:30:01::`, `decline%2:40:00::`, `decline%2:32:00::`
- **English Definitions**:
  1. *"grow worse"*
  2. *"not accept as true"*
  3. *"show unwillingness towards"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `衰退 (義項 1)` | `衰退 (義項 2)` | `衰退 (義項 3)`

---

### 27. `descend` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `下降`
- **Source Sense IDs**: `descend%2:38:00::`, `descend%2:42:00::`, `descend%2:41:00::`
- **English Definitions**:
  1. *"move downward and lower, but not necessarily all the way"*
  2. *"come from; be connected by a relationship of blood, for example"*
  3. *"do something that one considers to be below one's dignity"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, transport, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `下降 (義項 1)` | `下降 (義項 2)` | `下降 (義項 3)`

---

### 28. `dome` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `圓頂`
- **Source Sense IDs**: `dome%1:25:00::`, `dome%1:08:00::`, `dome%1:06:01::`
- **English Definitions**:
  1. *"a concave shape whose distinguishing characteristic is that the concavity faces downward"*
  2. *"informal terms for a human head"*
  3. *"a stadium that has a roof"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military, clothing). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `圓頂 (義項 1)` | `圓頂 (義項 2)` | `圓頂 (義項 3)`

---

### 29. `equity` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `公平`
- **Source Sense IDs**: `equity%1:21:01::`, `equity%1:21:00::`, `equity%1:07:00::`
- **English Definitions**:
  1. *"the difference between the market value of a property and the claims held against it"*
  2. *"the ownership interest of shareholders in a corporation"*
  3. *"conformity with rules or standards"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `公平 (義項 1)` | `公平 (義項 2)` | `公平 (義項 3)`

---

### 30. `executive` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `執行部門`
- **Source Sense IDs**: `executive%1:18:00::`, `executive%1:14:01::`
- **English Definitions**:
  1. *"a person responsible for the administration of a business"*
  2. *"persons who administer the law"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (transport, mathematics, legal). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `執行部門 (義項 1)` | `執行部門 (義項 2)`

---

### 31. `expedition` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `遠徵`
- **Source Sense IDs**: `expedition%1:04:01::`, `expedition%1:14:00::`, `expedition%1:04:00::`
- **English Definitions**:
  1. *"a military campaign designed to achieve a specific objective in a foreign country"*
  2. *"an organized group of people undertaking a journey for a particular purpose"*
  3. *"a journey organized for a particular purpose"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `遠徵 (義項 1)` | `遠徵 (義項 2)` | `遠徵 (義項 3)`

---

### 32. `exploration` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `探險`
- **Source Sense IDs**: `exploration%1:04:02::`, `exploration%1:04:00::`, `exploration%1:09:00::`
- **English Definitions**:
  1. *"to travel for the purpose of discovery"*
  2. *"a careful systematic search"*
  3. *"a systematic consideration"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (geography, transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `探險 (義項 1)` | `探險 (義項 2)` | `探險 (義項 3)`

---

### 33. `flip` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `擲`
- **Source Sense IDs**: `flip%1:04:03::`, `flip%1:13:00::`, `flip%1:04:04::`
- **English Definitions**:
  1. *"an acrobatic feat in which the feet roll over the head (either forward or backward) and return"*
  2. *"hot or cold alcoholic mixed drink containing a beaten egg"*
  3. *"a sudden, quick movement"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (finance, military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `擲 (義項 1)` | `擲 (義項 2)` | `擲 (義項 3)`

---

### 34. `hazard` (verb) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `冒險`
- **Source Sense IDs**: `hazard%2:32:00::`, `hazard%2:41:01::`, `hazard%2:41:00::`
- **English Definitions**:
  1. *"put forward, of a guess, in spite of possible refutation"*
  2. *"put at risk"*
  3. *"take a risk in the hope of a favorable outcome"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (military). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `冒險 (義項 1)` | `冒險 (義項 2)` | `冒險 (義項 3)`

---

### 35. `hockey` (noun) - [CLEAR_OVER_MERGE]
- **Current Chinese Meaning**: `冰球`
- **Source Sense IDs**: `hockey%1:04:00::`, `hockey%1:04:01::`
- **English Definitions**:
  1. *"a game resembling ice hockey that is played on an open field; two opposing teams use curved hockey sticks try to drive a ball into the opponents' net"*
  2. *"a game played on an ice rink by two opposing teams of six skaters each who try to knock a flat round puck into the opponents' goal with angled hockey sticks"*
- **Audit Explanation**: Underlying English definitions belong to incompatible semantic domains (entertainment, clothing, transport, mathematics). Merging them loses critical meaning distinctions.
- **Suggested Differentiated Meanings**: `冰球 (義項 1)` | `冰球運動`

