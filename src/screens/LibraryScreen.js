import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS } from '../theme/colors';
import { WORDS } from '../data/words';
import { getFavoriteWordIds } from '../storage/favorites';
import {
  isAllLevelsSelected,
  isSelectedLevel,
  wordMatchesSelectedLevel,
} from '../utils/wordLevels';

const LEVELS = [1, 2, 3, 4, 5, 6];

export default function LibraryScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Refresh the stars after returning from WordDetail or another tab.
  // Only read AsyncStorage; never overwrite the user's learning records.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadFavorites() {
        try {
          const ids = await getFavoriteWordIds();
          if (isActive) {
            // Normalize in memory in case storage IDs and WORDS IDs differ in type.
            setFavoriteIds(new Set(Array.from(ids ?? [], (id) => String(id))));
          }
        } catch (error) {
          console.warn('Unable to load favorite words:', error);
        }
      }

      loadFavorites();
      return () => {
        isActive = false;
      };
    }, [])
  );

  // Pre-calculate word counts for each level badge
  const levelCounts = useMemo(() => {
    const counts = { all: WORDS.length };
    LEVELS.forEach((lvl) => {
      counts[lvl] = 0;
    });
    WORDS.forEach((item) => {
      if (item.level && counts[item.level] !== undefined) {
        counts[item.level]++;
      }
    });
    return counts;
  }, []);

  const filteredWords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return WORDS.filter((item) => {
      const matchesSearch =
        !keyword ||
        String(item.word ?? '').toLowerCase().includes(keyword) ||
        String(item.meaning ?? '').toLowerCase().includes(keyword);

      const matchesLevel =
        wordMatchesSelectedLevel(item, selectedLevel);

      const matchesFavorite =
        !favoritesOnly || favoriteIds.has(String(item.id));

      return matchesSearch && matchesLevel && matchesFavorite;
    });
  }, [search, selectedLevel, favoritesOnly, favoriteIds]);

  const toggleLevel = useCallback((level) => {
    if (level === null) {
      setSelectedLevel(null);
    } else {
      setSelectedLevel((current) => (current === level ? null : level));
    }
  }, []);

  const openWord = useCallback(
    (item) => navigation.navigate('WordDetail', { word: item }),
    [navigation]
  );

  const renderWord = useCallback(
    ({ item }) => {
      const favorite = favoriteIds.has(String(item.id));

      return (
        <Pressable
          onPress={() => openWord(item)}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.wordRow}>
            <View style={styles.wordInfo}>
              <Text style={styles.word} numberOfLines={2}>
                {item.word}
              </Text>
              <Text style={styles.partOfSpeech}>
                {item.partOfSpeech}
              </Text>
            </View>

            <View style={styles.badgeRow}>
              {favorite && <Text style={styles.favoriteStar}>★</Text>}
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Lv.{item.level}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.meaning}>{item.meaning}</Text>
        </Pressable>
      );
    },
    [favoriteIds, openWord]
  );

  const allLevelsSelected =
    isAllLevelsSelected(selectedLevel);

  return (
    <View style={styles.container}>
      {/* Keep search and level selector outside virtualized list with safe flex bounds. */}
      <View style={styles.controls}>
        <View style={styles.header}>
          <Text style={styles.title}>軍械庫</Text>
          <Text style={styles.subtitle}>{WORDS.length} 個單字已裝備</Text>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="搜尋英文或中文..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="search"
          testID="library-search"
        />

        {/* Dynamic height level bar container to prevent height collapse or button clipping */}
        <View style={styles.levelBar}>
          <ScrollView
            horizontal
            style={styles.levelScroll}
            contentContainerStyle={styles.levelContent}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            directionalLockEnabled={false}
            testID="library-level-scroll"
          >
            <Pressable
              onPress={() => toggleLevel(null)}
              accessibilityRole="button"
              accessibilityState={{ selected: allLevelsSelected }}
              testID="library-level-all"
              style={({ pressed }) => [
                styles.levelButton,
                allLevelsSelected && styles.levelButtonActive,
                pressed && styles.levelButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  allLevelsSelected && styles.levelButtonTextActive,
                ]}
              >
                全部
              </Text>
            </Pressable>

            {LEVELS.map((level) => {
              const active =
                isSelectedLevel(selectedLevel, level);
              const count = levelCounts[level] ?? 0;

              return (
                <Pressable
                  key={level}
                  onPress={() => toggleLevel(level)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  testID={`library-level-${level}`}
                  style={({ pressed }) => [
                    styles.levelButton,
                    active && styles.levelButtonActive,
                    pressed && styles.levelButtonPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.levelButtonText,
                      active && styles.levelButtonTextActive,
                    ]}
                  >
                    Lv.{level}
                  </Text>
                  <Text
                    style={[
                      styles.levelCountText,
                      active && styles.levelCountTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultText} numberOfLines={1}>
            找到 {filteredWords.length} 個單字
            {!allLevelsSelected && selectedLevel !== null ? ` · Lv.${selectedLevel}` : ''}
          </Text>

          <Pressable
            onPress={() => setFavoritesOnly((current) => !current)}
            accessibilityRole="button"
            accessibilityState={{ selected: favoritesOnly }}
            accessibilityLabel={favoritesOnly ? '顯示全部單字' : '只看收藏單字'}
            testID="library-favorites-toggle"
            style={({ pressed }) => [
              styles.favoritesButton,
              favoritesOnly && styles.favoritesButtonActive,
              pressed && styles.favoritesButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.favoritesButtonText,
                favoritesOnly && styles.favoritesButtonTextActive,
              ]}
            >
              ★ 收藏
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        style={styles.listView}
        data={filteredWords}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderWord}
        extraData={favoriteIds}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.listContent}
        testID="library-word-list"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>找不到單字</Text>
            <Text style={styles.emptyText}>
              換個關鍵字、Level，或取消收藏篩選試試看
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  controls: {
    flexShrink: 0,
    zIndex: 10,
    marginBottom: 4,
  },
  header: {
    marginTop: 16,
    marginBottom: 14,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  searchInput: {
    height: 48,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    color: COLORS.text,
    fontSize: 15,
  },
  levelBar: {
    minHeight: 52,
    marginVertical: 10,
    flexShrink: 0,
    zIndex: 2,
  },
  levelScroll: {
    width: '100%',
    flexGrow: 0,
    flexShrink: 0,
  },
  levelContent: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 12,
  },
  levelButton: {
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 19,
    gap: 6,
  },
  levelButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  levelButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  levelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  levelButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  levelCountText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  levelCountTextActive: {
    color: COLORS.primary,
    backgroundColor: '#FFFFFF',
    fontWeight: '700',
  },
  resultRow: {
    minHeight: 38,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultText: {
    flexShrink: 1,
    color: COLORS.textMuted,
    fontSize: 13,
    marginRight: 8,
  },
  favoritesButton: {
    flexShrink: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  favoritesButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  favoritesButtonText: {
    color: COLORS.warning,
    fontWeight: '700',
    fontSize: 13,
  },
  favoritesButtonTextActive: {
    color: '#FFFFFF',
  },
  listView: {
    flex: 1,
    minHeight: 0,
    zIndex: 0,
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  cardPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.99 }],
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wordInfo: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  word: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '700',
  },
  partOfSpeech: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  favoriteStar: {
    color: COLORS.warning,
    fontSize: 18,
    marginRight: 8,
  },
  levelBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  levelText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  meaning: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 12,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
