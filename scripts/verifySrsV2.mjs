import { calculateSchedule, recordReview } from '../src/storage/progress.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import assert from 'assert';

async function runSrsTests() {
  console.log('====================================================');
  console.log('       RUNNING SRS V2 REGRESSION TEST SUITE         ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function check(condition, message) {
    if (condition) {
      console.log(`  ✔ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    const initial = {
      mastery: 2,
      streak: 2,
      intervalDays: 3,
      difficulty: 2.1,
      weakScore: 0
    };

    // 1. Rating: Again
    const againResult = calculateSchedule(initial, 'again');
    check(againResult.mastery === 1 && againResult.streak === 0 && againResult.intervalDays === 0 && againResult.difficulty === 1.9, 'Rating "again" resets streak and interval, decreases mastery and difficulty.');

    // 2. Rating: Hard
    const hardResult = calculateSchedule(initial, 'hard');
    check(hardResult.mastery === 3 && hardResult.streak === 1 && hardResult.intervalDays === 1 && hardResult.difficulty === 2.05, 'Rating "hard" increases mastery slightly, halves streak, scales interval safely.');

    // 3. Rating: Good
    const goodResult = calculateSchedule(initial, 'good');
    check(goodResult.mastery === 3 && goodResult.streak === 3 && goodResult.intervalDays === 6 && goodResult.difficulty === 2.15, 'Rating "good" increases mastery, scales interval by difficulty.');

    // 4. Rating: Easy
    const easyResult = calculateSchedule(initial, 'easy');
    check(easyResult.mastery === 4 && easyResult.streak === 4 && easyResult.difficulty === 2.25, 'Rating "easy" increases mastery by 2 (not instant 5), and scales interval aggressively.');

    // 5. XP anti-farming & Data Race
    // Mock AsyncStorage temporarily to test recordReview
    let store = {};
    AsyncStorage.getItem = async (k) => store[k] || null;
    AsyncStorage.setItem = async (k, v) => { store[k] = v; };
    AsyncStorage.multiSet = async (kvs) => { kvs.forEach(([k, v]) => { store[k] = v; }); };

    // Record a review
    const r1 = await recordReview('word1', 'good');
    check(r1.xpGain === 10, 'First review grants normal XP.');
    
    // Rapid repeat click (farming/race condition)
    const r2 = await recordReview('word1', 'easy');
    check(r2.xpGain === 0 && r2.mastery === r1.mastery, 'Rapid repeat review (isFarming) yields 0 XP and freezes state progression to prevent race conditions.');

    // 6. Review Dates (cross-midnight / exact 24hr check)
    const now = Date.now();
    const nextRevDate = new Date(goodResult.nextReview).getTime();
    const expectedDiffDays = (nextRevDate - now) / (1000 * 60 * 60 * 24);
    check(Math.abs(expectedDiffDays - 6) < 0.1, 'Next review date uses exact hours (+24h per day), preventing 23:50 -> 00:00 midnight skip.');

    console.log('\n----------------------------------------------------');
    console.log(`SUMMARY: ${passed} Passed, ${failed} Failed.`);
    console.log('----------------------------------------------------\n');

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runSrsTests();
