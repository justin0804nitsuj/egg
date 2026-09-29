import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@vocabapp/wordProgress';
const STATS_KEY = '@vocabapp/learningStats';

const DEFAULT_STATS = {
  xp: 0,
  totalReviews: 0,
  sessionsCompleted: 0,

  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,

  daily: {},
};

const CURRENT_STATE_VERSION = 2;

const DEFAULT_WORD_PROGRESS = {
  version: CURRENT_STATE_VERSION,
  mastery: 0,
  difficulty: 2.2,
  weakScore: 0,
  streak: 0,

  reviewCount: 0,
  correctCount: 0,
  wrongCount: 0,

  intervalDays: 0,

  lastReviewed: null,
  nextReview: null,
};

function normalizeWordProgress(progress = {}) {
  let normalized = { ...progress };

  if (!normalized.version || normalized.version < CURRENT_STATE_VERSION) {
    normalized.version = CURRENT_STATE_VERSION;
    normalized.difficulty = normalized.easeFactor ?? 2.2;
    delete normalized.easeFactor;
    
    normalized.streak = normalized.repetitions ?? 0;
    delete normalized.repetitions;

    normalized.weakScore = 0;
    
    normalized.mastery = normalized.mastery ?? 0;
    normalized.reviewCount = normalized.reviewCount ?? 0;
    normalized.correctCount = normalized.correctCount ?? 0;
    normalized.wrongCount = normalized.wrongCount ?? 0;
    normalized.intervalDays = normalized.intervalDays ?? 0;
    normalized.lastReviewed = normalized.lastReviewed ?? null;
    normalized.nextReview = normalized.nextReview ?? null;
  }

  return {
    ...DEFAULT_WORD_PROGRESS,
    ...normalized,
  };
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function dateKeyToUTC(dateKey) {
  const [year, month, day] =
    dateKey.split('-').map(Number);

  return Date.UTC(
    year,
    month - 1,
    day
  );
}

function isYesterday(previousDate, today) {
  if (!previousDate) {
    return false;
  }

  const difference =
    dateKeyToUTC(today) -
    dateKeyToUTC(previousDate);

  return (
    difference ===
    24 * 60 * 60 * 1000
  );
}

function addMinutes(date, minutes) {
  return new Date(
    date.getTime() +
      minutes * 60 * 1000
  );
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

async function getProgressMap() {
  try {
    const value =
      await AsyncStorage.getItem(
        PROGRESS_KEY
      );

    if (!value) {
      return {};
    }

    const parsed = JSON.parse(value);

    return parsed ?? {};
  } catch (error) {
    console.error(
      'Failed to load word progress:',
      error
    );

    return {};
  }
}

export async function getAllWordProgress() {
  const progress =
    await getProgressMap();

  const normalized = {};

  Object.entries(progress).forEach(
    ([wordId, value]) => {
      normalized[wordId] =
        normalizeWordProgress(value);
    }
  );

  return normalized;
}

export async function getWordProgress(wordId) {
  const progress =
    await getProgressMap();

  return normalizeWordProgress(
    progress[wordId]
  );
}

export async function getLearningStats() {
  try {
    const value =
      await AsyncStorage.getItem(
        STATS_KEY
      );

    if (!value) {
      return {
        ...DEFAULT_STATS,
      };
    }

    const parsed = JSON.parse(value);

    return {
      ...DEFAULT_STATS,
      ...parsed,

      daily: parsed.daily ?? {},
    };
  } catch (error) {
    console.error(
      'Failed to load learning stats:',
      error
    );

    return {
      ...DEFAULT_STATS,
    };
  }
}

export function calculateSchedule(
  current,
  rating,
  isFarming = false
) {
  const now = new Date();

  let mastery = current.mastery;
  let streak = current.streak;
  let intervalDays = current.intervalDays;
  let difficulty = current.difficulty;
  let weakScore = current.weakScore;

  let nextReview = null;
  let xpGain = 0;

  if (rating === 'again') {
    mastery = Math.max(0, mastery - 1);
    streak = 0;
    intervalDays = 0;
    difficulty = Math.round(Math.max(1.3, difficulty - 0.2) * 100) / 100;
    weakScore += 1;
    nextReview = addMinutes(now, 10);
    xpGain = 2;
  }

  if (rating === 'hard') {
    mastery = Math.min(5, mastery + 1);
    streak = Math.max(1, Math.floor(streak / 2)); // reduce streak but don't reset to 0
    difficulty = Math.round(Math.max(1.3, difficulty - 0.05) * 100) / 100;
    intervalDays = streak <= 1 ? 1 : Math.max(1, Math.round(Math.max(1, intervalDays) * 1.2));
    nextReview = addDays(now, intervalDays);
    xpGain = 5;
  }

  if (rating === 'good') {
    mastery = Math.min(5, mastery + 1); // Good increases mastery moderately
    streak += 1;
    weakScore = Math.max(0, weakScore - 1);
    difficulty = Math.round(Math.min(3.0, difficulty + 0.05) * 100) / 100;
    if (streak === 1) {
      intervalDays = 1;
    } else if (streak === 2) {
      intervalDays = 3;
    } else {
      intervalDays = Math.max(1, Math.round(Math.max(1, intervalDays) * difficulty));
    }
    nextReview = addDays(now, intervalDays);
    xpGain = 10;
  }

  if (rating === 'easy') {
    mastery = Math.min(5, mastery + 2); // Does not max instantly
    streak += 2;
    weakScore = 0;
    difficulty = Math.round(Math.min(3.0, difficulty + 0.15) * 100) / 100;
    if (streak <= 2) {
      intervalDays = 4;
    } else {
      intervalDays = Math.max(1, Math.round(Math.max(1, intervalDays) * difficulty * 1.3));
    }
    nextReview = addDays(now, intervalDays);
    xpGain = 15;
  }

  if (isFarming) {
    xpGain = 0;
  }

  return {
    mastery,
    streak,
    intervalDays,
    difficulty,
    weakScore,
    nextReview: nextReview?.toISOString() ?? null,
    xpGain,
  };
}

export async function recordReview(
  wordId,
  rating
) {
  const progress =
    await getProgressMap();

  const stats =
    await getLearningStats();

  const current =
    normalizeWordProgress(
      progress[wordId]
    );

  const nowTime = Date.now();
  const lastRevTime = current.lastReviewed ? new Date(current.lastReviewed).getTime() : null;
  const isFarming = lastRevTime && (nowTime - lastRevTime < 5 * 60 * 1000);

  const schedule = isFarming ? {
    mastery: current.mastery,
    streak: current.streak,
    intervalDays: current.intervalDays,
    difficulty: current.difficulty,
    weakScore: current.weakScore,
    nextReview: current.nextReview,
    xpGain: 0,
  } : calculateSchedule(
      current,
      rating,
      false
    );

  const correct =
    rating !== 'again';

  const now =
    new Date(nowTime).toISOString();

  progress[wordId] = {
    ...current,
    mastery: schedule.mastery,
    streak: schedule.streak,
    intervalDays: schedule.intervalDays,
    difficulty: schedule.difficulty,
    weakScore: schedule.weakScore,

    reviewCount:
      current.reviewCount + 1,

    correctCount:
      correct
        ? current.correctCount + 1
        : current.correctCount,

    wrongCount:
      !correct
        ? current.wrongCount + 1
        : current.wrongCount,

    lastReviewed: now,
    nextReview: schedule.nextReview,
  };

  const today =
    getLocalDateKey();

  const todayStats =
    stats.daily[today] ?? {
      reviews: 0,
      xp: 0,
      sessions: 0,
    };

  const newStats = {
    ...stats,

    xp:
      stats.xp +
      schedule.xpGain,

    totalReviews:
      stats.totalReviews + 1,

    daily: {
      ...stats.daily,

      [today]: {
        ...todayStats,

        reviews:
          todayStats.reviews + 1,

        xp:
          todayStats.xp +
          schedule.xpGain,
      },
    },
  };

  try {
    await AsyncStorage.multiSet([
      [
        PROGRESS_KEY,
        JSON.stringify(progress),
      ],

      [
        STATS_KEY,
        JSON.stringify(newStats),
      ],
    ]);

    return {
      xpGain:
        schedule.xpGain,

      totalXp:
        newStats.xp,

      mastery:
        schedule.mastery,

      nextReview:
        schedule.nextReview,

      intervalDays:
        schedule.intervalDays,
    };
  } catch (error) {
    console.error(
      'Failed to save review:',
      error
    );

    return {
      xpGain: 0,

      totalXp:
        stats.xp,

      mastery:
        current.mastery,

      nextReview:
        current.nextReview,

      intervalDays:
        current.intervalDays,
    };
  }
}

export async function completeSession() {
  const stats =
    await getLearningStats();

  const today =
    getLocalDateKey();

  let currentStreak =
    stats.currentStreak;

  if (
    stats.lastStudyDate !== today
  ) {
    if (
      isYesterday(
        stats.lastStudyDate,
        today
      )
    ) {
      currentStreak =
        stats.currentStreak + 1;
    } else {
      currentStreak = 1;
    }
  }

  const longestStreak =
    Math.max(
      stats.longestStreak,
      currentStreak
    );

  const todayStats =
    stats.daily[today] ?? {
      reviews: 0,
      xp: 0,
      sessions: 0,
    };

  const newStats = {
    ...stats,

    sessionsCompleted:
      stats.sessionsCompleted + 1,

    currentStreak,
    longestStreak,

    lastStudyDate: today,

    daily: {
      ...stats.daily,

      [today]: {
        ...todayStats,

        sessions:
          todayStats.sessions + 1,
      },
    },
  };

  try {
    await AsyncStorage.setItem(
      STATS_KEY,
      JSON.stringify(newStats)
    );

    return newStats;
  } catch (error) {
    console.error(
      'Failed to complete session:',
      error
    );

    return stats;
  }
}

export async function getDashboardData() {
  const stats =
    await getLearningStats();

  const progress =
    await getAllWordProgress();

  const today =
    getLocalDateKey();

  const todayStats =
    stats.daily[today] ?? {
      reviews: 0,
      xp: 0,
      sessions: 0,
    };

  const values =
    Object.values(progress);

  const learnedWords =
    values.filter(
      (item) =>
        item.reviewCount > 0
    ).length;

  const masteredWords =
    values.filter(
      (item) =>
        item.mastery >= 5
    ).length;

  const now =
    Date.now();

  const dueReviews =
    values.filter((item) => {
      if (
        item.reviewCount <= 0
      ) {
        return false;
      }

      if (!item.nextReview) {
        return true;
      }

      const dueTime =
        new Date(
          item.nextReview
        ).getTime();

      return (
        Number.isNaN(dueTime) ||
        dueTime <= now
      );
    }).length;

  let streak =
    stats.currentStreak;

  if (
    stats.lastStudyDate &&
    stats.lastStudyDate !== today &&
    !isYesterday(
      stats.lastStudyDate,
      today
    )
  ) {
    streak = 0;
  }

  const level =
    Math.floor(
      stats.xp / 100
    ) + 1;

  const xpInLevel =
    stats.xp % 100;

  return {
    xp:
      stats.xp,

    level,
    xpInLevel,
    xpNeeded: 100,

    streak,

    longestStreak:
      stats.longestStreak,

    totalReviews:
      stats.totalReviews,

    sessionsCompleted:
      stats.sessionsCompleted,

    learnedWords,
    masteredWords,
    dueReviews,

    today: {
      reviews:
        todayStats.reviews,

      xp:
        todayStats.xp,

      sessions:
        todayStats.sessions,
    },
  };
}
export async function grantBonusXp(amount) {
  if (!amount || amount <= 0) {
    return getLearningStats();
  }

  const stats =
    await getLearningStats();

  const today =
    getLocalDateKey();

  const todayStats =
    stats.daily[today] ?? {
      reviews: 0,
      xp: 0,
      sessions: 0,
    };

  const newStats = {
    ...stats,

    xp:
      stats.xp + amount,

    daily: {
      ...stats.daily,

      [today]: {
        ...todayStats,

        xp:
          todayStats.xp + amount,
      },
    },
  };

  try {
    await AsyncStorage.setItem(
      STATS_KEY,
      JSON.stringify(newStats)
    );

    return newStats;
  } catch (error) {
    console.error(
      'Failed to grant bonus XP:',
      error
    );

    return stats;
  }
}