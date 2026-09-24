import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@vocabapp/favoriteWordIds';

export async function getFavoriteWordIds() {
  try {
    const value = await AsyncStorage.getItem(FAVORITES_KEY);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load favorites:', error);
    return [];
  }
}

export async function isFavoriteWord(wordId) {
  const ids = await getFavoriteWordIds();

  return ids.includes(wordId);
}

export async function toggleFavoriteWord(wordId) {
  try {
    const ids = await getFavoriteWordIds();

    const alreadyFavorite = ids.includes(wordId);

    const nextIds = alreadyFavorite
      ? ids.filter((id) => id !== wordId)
      : [...ids, wordId];

    await AsyncStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(nextIds)
    );

    return !alreadyFavorite;
  } catch (error) {
    console.error('Failed to update favorite:', error);
    return false;
  }
}