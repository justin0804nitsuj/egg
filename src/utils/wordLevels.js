export function isAllLevelsSelected(selectedLevel) {
  return selectedLevel === null;
}

export function wordHasLevel(word, level) {
  return Number(word.level) === Number(level);
}

export function wordMatchesSelectedLevel(word, selectedLevel) {
  return (
    isAllLevelsSelected(selectedLevel) ||
    Number(word.level) === Number(selectedLevel)
  );
}

export function isSelectedLevel(selectedLevel, level) {
  return (
    !isAllLevelsSelected(selectedLevel) &&
    Number(selectedLevel) === Number(level)
  );
}
