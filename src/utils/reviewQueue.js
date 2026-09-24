import {
  getAllWordProgress,
} from '../storage/progress';

function shuffle(items) {
  const array = [...items];

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [
      array[i],
      array[j],
    ] = [
      array[j],
      array[i],
    ];
  }

  return array;
}

function getDuePriority(
  progress,
  now
) {
  const masteryPenalty =
    (5 - progress.mastery) *
    20;

  const accuracy =
    progress.reviewCount > 0
      ? progress.correctCount /
        progress.reviewCount
      : 0;

  const accuracyPenalty =
    (1 - accuracy) * 30;

  let overdueScore = 0;

  if (progress.nextReview) {
    const dueTime =
      new Date(
        progress.nextReview
      ).getTime();

    if (
      !Number.isNaN(dueTime)
    ) {
      overdueScore =
        Math.max(
          0,
          (now - dueTime) /
            (60 * 60 * 1000)
        );
    }
  }

  return (
    masteryPenalty +
    accuracyPenalty +
    overdueScore
  );
}

export async function buildReviewSession({
  words,
  selectedLevel = null,
  size = 10,
}) {
  const progressMap =
    await getAllWordProgress();

  const pool =
    selectedLevel === null
      ? words
      : words.filter(
          (word) =>
            word.level ===
            selectedLevel
        );

  const now =
    Date.now();

  const dueWords = [];
  const newWords = [];
  const futureWords = [];

  pool.forEach((word) => {
    const progress =
      progressMap[word.id];

    if (
      !progress ||
      progress.reviewCount === 0
    ) {
      newWords.push(word);

      return;
    }

    if (!progress.nextReview) {
      dueWords.push({
        word,
        progress,
      });

      return;
    }

    const dueTime =
      new Date(
        progress.nextReview
      ).getTime();

    if (
      Number.isNaN(dueTime) ||
      dueTime <= now
    ) {
      dueWords.push({
        word,
        progress,
      });
    } else {
      futureWords.push({
        word,
        progress,
      });
    }
  });

  dueWords.sort(
    (a, b) =>
      getDuePriority(
        b.progress,
        now
      ) -
      getDuePriority(
        a.progress,
        now
      )
  );

  futureWords.sort(
    (a, b) => {
      const aTime =
        new Date(
          a.progress.nextReview
        ).getTime();

      const bTime =
        new Date(
          b.progress.nextReview
        ).getTime();

      return aTime - bTime;
    }
  );

  const ordered = [
    ...dueWords.map(
      (item) => item.word
    ),

    ...shuffle(newWords),

    ...futureWords.map(
      (item) => item.word
    ),
  ];

  return ordered.slice(
    0,
    Math.min(
      size,
      ordered.length
    )
  );
}