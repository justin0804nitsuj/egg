function shuffle(items) {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [array[i], array[j]] = [
      array[j],
      array[i],
    ];
  }

  return array;
}

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function buildDistractors({
  target,
  words,
  getDisplayValue,
}) {
  const targetValue = normalize(
    getDisplayValue(target)
  );

  const candidates = words.filter(
    (word) => {
      if (word.id === target.id) {
        return false;
      }

      const value = normalize(
        getDisplayValue(word)
      );

      return (
        value &&
        value !== targetValue
      );
    }
  );

  const sameLevelAndPos = shuffle(
    candidates.filter(
      (word) =>
        word.level === target.level &&
        word.partOfSpeech ===
          target.partOfSpeech
    )
  );

  const sameLevel = shuffle(
    candidates.filter(
      (word) =>
        word.level === target.level
    )
  );

  const others = shuffle(
    candidates
  );

  const selected = [];

  const usedIds = new Set([
    target.id,
  ]);

  const usedValues = new Set([
    targetValue,
  ]);

  function add(source) {
    for (const word of source) {
      if (selected.length >= 3) {
        break;
      }

      const value = normalize(
        getDisplayValue(word)
      );

      if (
        usedIds.has(word.id) ||
        usedValues.has(value)
      ) {
        continue;
      }

      selected.push(word);

      usedIds.add(word.id);
      usedValues.add(value);
    }
  }

  add(sameLevelAndPos);
  add(sameLevel);
  add(others);

  return selected;
}

export function createEnglishToChineseQuestion(
  target,
  words
) {
  if (!target) {
    return null;
  }

  const distractors =
    buildDistractors({
      target,
      words,
      getDisplayValue: (word) =>
        word.meaning,
    });

  const choices = shuffle([
    target,
    ...distractors,
  ]).map((word) => ({
    id: word.id,

    text: word.meaning,

    correct:
      word.id === target.id,
  }));

  return {
    targetId: target.id,

    word: target.word,

    partOfSpeech:
      target.partOfSpeech,

    level: target.level,

    correctMeaning:
      target.meaning,

    choices,
  };
}

export function createChineseToEnglishQuestion(
  target,
  words
) {
  if (!target) {
    return null;
  }

  const distractors =
    buildDistractors({
      target,
      words,
      getDisplayValue: (word) =>
        word.word,
    });

  const choices = shuffle([
    target,
    ...distractors,
  ]).map((word) => ({
    id: word.id,

    text: word.word,

    correct:
      word.id === target.id,
  }));

  return {
    targetId: target.id,

    meaning: target.meaning,

    partOfSpeech:
      target.partOfSpeech,

    level: target.level,

    correctWord:
      target.word,

    choices,
  };
}