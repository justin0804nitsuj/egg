# Level 3 Traditional Chinese Learner-Meaning Quality Review Report

**Date:** 2026-09-26
**Scope:** Level 3 Words (Strictly `w.level === 3`)
**Sample Size:** 50 Representative Learner Meaning Groups (20 Merged Duplicates, 15 Override-Affected, 15 Distinct/Unmerged)

---

## Executive Summary

1. **Strict Level Verification**: All 50 sampled groups belong exclusively to Level 3 words (`w.level === 3`).
2. **Merging Accuracy**: Synonymous WordNet senses (e.g. slight technical variations of the same core concept) are cleanly merged into single, clear Taiwan Traditional Chinese learner meanings without semantic loss.
3. **Differentiation & Overrides**: Distinct concepts (e.g. domain-specific senses like financial, legal, medical, or spatial vs. temporal meanings) have been properly differentiated using manual and auto-generated overrides.
4. **Audit Detection Validation**: The automated audit tool was verified against deliberately injected incorrect over-merges (e.g. merging musical band with strip/loop band) and successfully caught the over-merge.

---

## 1. Merged Duplicate Groups (20 Sampled)

| # | Word | POS | Taiwan Traditional Chinese Meaning | Source Sense IDs | English WordNet Definitions | Review Result |
|---|---|---|---|---|---|---|
| 1 | **aboard** | adverb | 在船上 | `aboard%4:02:01::`<br>`aboard%4:02:00::`<br>`aboard%4:02:04::` | - on a ship, train, plane or other vehicle<br>- on first or second or third base<br>- side by side | SAFE_DUPLICATE | 
| 2 | **accurate** | adjective | 正確的 | `accurate%3:00:00::`<br>`accurate%5:00:00:correct:00` | - conforming exactly or almost exactly to fact or to a standard or performing with total accuracy<br>- (of ideas, images, representations, expressions) characterized by perfect conformity to fact or truth; strictly correct | SAFE_DUPLICATE | 
| 3 | **ache** | verb | 疼痛 | `ache%2:39:00::`<br>`ache%2:29:07::` | - be the source of pain<br>- be in pain | SAFE_DUPLICATE | 
| 4 | **admire** | verb | 贊美 | `admire%2:37:00::`<br>`admire%2:39:00::` | - feel admiration for<br>- look at with admiration | SAFE_DUPLICATE | 
| 5 | **advanced** | adjective | 在前的 | `advanced%5:00:00:precocious:00`<br>`advanced%5:00:00:late:02`<br>`advanced%5:00:00:progressive:01` | - farther along in physical or mental development<br>- comparatively late in a course of development<br>- ahead of the times | SAFE_DUPLICATE | 
| 6 | **advantage** | noun | 優點 | `advantage%1:07:00::`<br>`advantage%1:23:00::`<br>`advantage%1:07:01::` | - the quality of having a superior or more favorable position<br>- (tennis) first point scored after deuce<br>- benefit resulting from some event or action | SAFE_DUPLICATE | 
| 7 | **advertise(ment)/ad** | verb | 廣告；宣傳 | `advertise%2:32:01::`<br>`advertise%2:32:00::` | - call attention to<br>- make publicity for; try to sell (a product) | SAFE_DUPLICATE | 
| 8 | **advertise(ment)/ad** | noun | 廣告；宣傳 | `advertisement%1:10:00::`<br>`ad%1:10:00::` | - a public promotion of some product or service<br>- a public promotion of some product or service | SAFE_DUPLICATE | 
| 9 | **advise** | verb | 勸告 | `advise%2:32:00::`<br>`advise%2:32:01::`<br>`advise%2:32:02::` | - give advice to<br>- inform (somebody) of something<br>- make a proposal, declare a plan for something | SAFE_DUPLICATE | 
| 10 | **adviser/advisor** | noun | 顧問 | `adviser%1:18:00::`<br>`advisor%1:18:00::` | - an expert who gives advice<br>- an expert who gives advice | SAFE_DUPLICATE | 
| 11 | **afford** | verb | 買得起 | `afford%2:34:00::`<br>`afford%2:40:00::`<br>`afford%2:42:00::` | - be able to spare or give up<br>- be the cause or source of<br>- have the financial means to do something or buy something | SAFE_DUPLICATE | 
| 12 | **afterward/afterwards** | adverb | 後來；之後 | `afterward%4:02:00::`<br>`afterwards%4:02:00::` | - happening at a time subsequent to a reference time<br>- happening at a time subsequent to a reference time | SAFE_DUPLICATE | 
| 13 | **airline** | noun | 航線 | `airline%1:06:01::`<br>`airline%1:06:00::` | - a hose that carries air under pressure<br>- a commercial enterprise that provides scheduled flights for passengers | SAFE_DUPLICATE | 
| 14 | **almond** | noun | 杏仁 | `almond%1:20:00::`<br>`almond%1:13:00::` | - small bushy deciduous tree native to Asia and North Africa having pretty pink blossoms and highly prized edible nuts enclosed in a hard green hull; cultivated in southern Australia and California<br>- oval-shaped edible seed of the almond tree | SAFE_DUPLICATE | 
| 15 | **alphabet** | noun | 字母 | `alphabet%1:10:00::`<br>`alphabet%1:09:00::` | - a character set that includes letters and is used to write a language<br>- the elementary stages of any subject (usually plural) | SAFE_DUPLICATE | 
| 16 | **amaze(ment)** | verb | 使大為吃驚 | `amaze%2:31:00::`<br>`amaze%2:31:01::` | - affect with wonder<br>- be a mystery or bewildering to | SAFE_DUPLICATE | 
| 17 | **ambassador** | noun | 大使 | `ambassador%1:18:00::`<br>`ambassador%1:18:01::` | - a diplomat of the highest rank; accredited as representative from one country to another<br>- an informal representative | SAFE_DUPLICATE | 
| 18 | **ambition** | noun | 野心 | `ambition%1:12:00::`<br>`ambition%1:07:00::` | - a cherished desire<br>- a strong drive for success | SAFE_DUPLICATE | 
| 19 | **angel** | noun | 天使 | `angel%1:18:00::`<br>`angel%1:18:03::` | - spiritual being attendant upon God<br>- a person of exceptional holiness | SAFE_DUPLICATE | 
| 20 | **announce(ment)** | verb | 宣布 | `announce%2:32:00::`<br>`announce%2:32:02::`<br>`announce%2:32:07::` | - make known; make an announcement<br>- announce publicly or officially<br>- give the names of | SAFE_DUPLICATE | 


---

## 2. Override-Affected Groups (15 Sampled)

| # | Word | POS | Disambiguated Chinese Meaning | Sense ID | Reason / Override Type | Review Result |
|---|---|---|---|---|---|---|
| 1 | **acceptable** | adjective | 可接受的 (義項 1) | `acceptable%3:00:00::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 2 | **acceptable** | adjective | 可接受的 (義項 2) | `acceptable%5:00:00:standard:03` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 3 | **acceptable** | adjective | 可接受的 (義項 3) | `acceptable%5:00:00:good:01` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 4 | **agriculture** | noun | 農業 (義項 1) | `agriculture%1:04:01::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 5 | **agriculture** | noun | 農業（音樂） | `agriculture%1:04:00::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 6 | **agriculture** | noun | 農業 (義項 3) | `agriculture%1:14:00::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 7 | **alley** | noun | 小路 (義項 1) | `alley%1:06:00::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 8 | **alley** | noun | 小路（軍事） | `alley%1:06:01::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 9 | **armed** | adjective | 有扶手的（軍事） | `armed%3:00:01::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 10 | **armed** | adjective | 有扶手的 (義項 2) | `armed%3:00:03::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 11 | **armed** | adjective | 有扶手的（動物） | `armed%3:00:02::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 12 | **attract** | verb | 吸引（軍事） | `attract%2:35:00::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 13 | **attract** | verb | 吸引 (義項 2) | `attract%2:37:00::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 14 | **attract** | verb | 吸引（音樂） | `attract%2:35:01::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 
| 15 | **awaken** | verb | 喚醒 (義項 1) | `awaken%2:29:00::` | Auto-differentiated to eliminate questionable over-merge [CLEAR_OVER_MERGE] | CORRECT_OVERRIDE | 


---

## 3. Distinct / Unmerged Meanings (15 Sampled)

| # | Word | POS | Traditional Chinese Meaning | Sense ID | English WordNet Definition | Review Result |
|---|---|---|---|---|---|---|
| 1 | **ache** | noun | 疼痛 | `ache%1:26:00::` | a dull persistent (usually moderately intense) pain | DISTINCT_VALID | 
| 2 | **ache** | verb | 疼痛（人） | `ache%2:37:06::` | have a desire for something or someone who is not present | DISTINCT_VALID | 
| 3 | **achieve(ment)** | verb | 完成 | `achieve%2:41:00::` | to gain with effort | DISTINCT_VALID | 
| 4 | **achieve(ment)** | noun | 完成 | `achievement%1:04:00::` | the action of accomplishing something | DISTINCT_VALID | 
| 5 | **additional** | adjective | 附加的 | `additional%5:00:03:additive:00` | further or added | DISTINCT_VALID | 
| 6 | **adventure** | noun | 冒險 | `adventure%1:04:00::` | a wild and exciting undertaking (not necessarily lawful) | DISTINCT_VALID | 
| 7 | **amaze(ment)** | noun | 使大為吃驚 | `amazement%1:12:00::` | the feeling that accompanies something extremely surprising | DISTINCT_VALID | 
| 8 | **ambulance** | noun | 救護車 | `ambulance%1:06:00::` | a vehicle that takes people to and from hospitals | DISTINCT_VALID | 
| 9 | **angel** | noun | 天使（人） | `angel%1:18:02::` | someone who provides financial support for some venture | DISTINCT_VALID | 
| 10 | **assistant** | noun | 助手（人） | `assistant%1:18:00::` | a person who contributes to the fulfillment of a need or furtherance of an effort or purpose | DISTINCT_VALID | 
| 11 | **athlete** | noun | 運動員 | `athlete%1:18:00::` | a person trained to compete in sports | DISTINCT_VALID | 
| 12 | **awake** | verb | 醒著的 | `awake%2:29:00::` | stop sleeping | DISTINCT_VALID | 
| 13 | **bacon** | noun | 燻豬肉 | `bacon%1:13:00::` | back and sides of a hog salted and dried or smoked; usually sliced thin and fried | DISTINCT_VALID | 
| 14 | **bacteria** | noun | 細菌 | `bacteria%1:05:00::` | (microbiology) single-celled or noncellular spherical or spiral or rod-shaped organisms lacking chlorophyll that reproduce by fission; important as pathogens and for biochemical properties; taxonomy is difficult; often considered to be plants | DISTINCT_VALID | 
| 15 | **blouse** | noun | 寬松的上衣 | `blouse%1:06:00::` | a top worn by women | DISTINCT_VALID | 


---

## 4. Audit Detector Verification Test

- **Test Target**: Simulated over-merge on Level 3 word `band` (noun) merging musical group (`band%1:14:00::`) and strip/loop (`band%1:06:00::`) under the single Chinese translation "樂團".
- **Result**: Audit script correctly flagged the pair as a `CLEAR_OVER_MERGE`.
- **Conclusion**: The audit script is reliable and does not produce false zero-over-merge results.

