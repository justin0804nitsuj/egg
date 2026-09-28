export function isAllLevelsSelected(selectedLevel) {
  return (
    selectedLevel === null ||
    selectedLevel === undefined ||
    selectedLevel === '' ||
    selectedLevel === 'all'
  );
}

export function wordHasLevel(word, level) {
  if (!word || word.level == null || level == null) return false;
  return Number(word.level) === Number(level);
}

export function wordMatchesSelectedLevel(word, selectedLevel) {
  if (isAllLevelsSelected(selectedLevel)) return true;
  if (!word || word.level == null) return false;
  return Number(word.level) === Number(selectedLevel);
}

export function isSelectedLevel(selectedLevel, level) {
  if (isAllLevelsSelected(selectedLevel)) return false;
  return Number(selectedLevel) === Number(level);
}

