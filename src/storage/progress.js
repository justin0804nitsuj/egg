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

const DEFAULT_WORD_PROGRESS = {
  mastery: 0,

  reviewCount: 0,
  correctCount: 0,
  wrongCount: 0,

  repetitions: 0,
  intervalDays: 0,
  easeFactor: 2.2,

  lastReviewed: null,
  nextReview: null,
};

function normalizeWordProgress(progress = {}) {
  return {
    ...DEFAULT_WORD_PROGRESS,
    ...progress,
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
  return new Date(
    date.getTime() +
      days * 24 * 60 * 60 * 1000
  );
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

function calculateSchedule(
  current,
  rating
) {
  const now = new Date();

  let mastery = current.mastery;

  let repetitions =
    current.repetitions;

  let intervalDays =
    current.intervalDays;

  let easeFactor =
    current.easeFactor;

  let nextReview = null;

  let xpGain = 0;

  if (rating === 'again') {
    mastery = Math.max(
      0,
      mastery - 1
    );

    repetitions = 0;
    intervalDays = 0;

    easeFactor = Math.max(
      1.3,
      easeFactor - 0.2
    );

    nextReview =
      addMinutes(now, 10);

    xpGain = 2;
  }

  if (rating === 'hard') {
    mastery = Math.min(
      5,
      mastery + 1
    );

    repetitions += 1;

    easeFactor = Math.max(
      1.3,
      easeFactor - 0.05
    );

    if (
      current.repetitions === 0
    ) {
      intervalDays = 1;
    } else {
      intervalDays =
        Math.max(
          1,
          Math.round(
            Math.max(
              1,
              current.intervalDays
            ) * 1.5
          )
        );
    }

    nextReview =
      addDays(
        now,
        intervalDays
      );

    xpGain = 5;
  }

  if (rating === 'good') {
    mastery = Math.min(
      5,
      mastery + 2
    );

    repetitions += 1;

    easeFactor = Math.min(
      3,
      easeFactor + 0.05
    );

    if (
      current.repetitions === 0
    ) {
      intervalDays = 1;
    } else if (
      current.repetitions === 1
    ) {
      intervalDays = 3;
    } else {
      intervalDays =
        Math.max(
          1,
          Math.round(
            Math.max(
              1,
              current.intervalDays
            ) * easeFactor
          )
        );
    }

    nextReview =
      addDays(
        now,
        intervalDays
      );

    xpGain = 10;
  }

  return {
    mastery,
    repetitions,
    intervalDays,
    easeFactor,

    nextReview:
      nextReview?.toISOString() ??
      null,

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

  const schedule =
    calculateSchedule(
      current,
      rating
    );

  const correct =
    rating !== 'again';

  const now =
    new Date().toISOString();

  progress[wordId] = {
    ...current,

    mastery:
      schedule.mastery,

    repetitions:
      schedule.repetitions,

    intervalDays:
      schedule.intervalDays,

    easeFactor:
      schedule.easeFactor,

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

    nextReview:
      schedule.nextReview,
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