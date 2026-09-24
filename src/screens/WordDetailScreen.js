import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import * as Speech
  from 'expo-speech';

import {
  COLORS,
} from '../theme/colors';

import {
  isFavoriteWord,
  toggleFavoriteWord,
} from '../storage/favorites';

import {
  getWordProgress,
} from '../storage/progress';

const DEFAULT_PROGRESS = {
  mastery: 0,

  reviewCount: 0,
  correctCount: 0,
  wrongCount: 0,

  intervalDays: 0,

  lastReviewed: null,
  nextReview: null,
};

function formatNextReview(
  nextReview
) {
  if (!nextReview) {
    return '尚未安排';
  }

  const target =
    new Date(nextReview);

  const now =
    new Date();

  const difference =
    target.getTime() -
    now.getTime();

  if (
    Number.isNaN(
      target.getTime()
    )
  ) {
    return '尚未安排';
  }

  if (difference <= 0) {
    return '現在';
  }

  const minutes =
    Math.ceil(
      difference /
        (60 * 1000)
    );

  if (minutes < 60) {
    return `${minutes} 分鐘後`;
  }

  const hours =
    Math.ceil(
      minutes / 60
    );

  if (hours < 24) {
    return `${hours} 小時後`;
  }

  const days =
    Math.ceil(
      hours / 24
    );

  return `${days} 天後`;
}

export default function WordDetailScreen({
  route,
}) {
  const { word } =
    route.params;

  const [
    favorite,
    setFavorite,
  ] = useState(false);

  const [
    progress,
    setProgress,
  ] = useState(
    DEFAULT_PROGRESS
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadData() {
        const [
          favoriteResult,
          progressResult,
        ] =
          await Promise.all([
            isFavoriteWord(
              word.id
            ),

            getWordProgress(
              word.id
            ),
          ]);

        if (!active) {
          return;
        }

        setFavorite(
          favoriteResult
        );

        setProgress(
          progressResult
        );
      }

      loadData();

      return () => {
        active = false;
      };
    }, [word.id])
  );

  async function handleFavorite() {
    const result =
      await toggleFavoriteWord(
        word.id
      );

    setFavorite(result);
  }

  function handleSpeak() {
    Speech.stop();

    Speech.speak(
      word.word,
      {
        language: 'en-US',

        rate: 0.85,

        pitch: 1,
      }
    );
  }

  const totalAnswers =
    progress.correctCount +
    progress.wrongCount;

  const accuracy =
    totalAnswers > 0
      ? Math.round(
          (
            progress.correctCount /
            totalAnswers
          ) * 100
        )
      : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.hero}>
        <View
          style={
            styles.levelBadge
          }
        >
          <Text
            style={
              styles.levelText
            }
          >
            LEVEL {word.level}
          </Text>
        </View>

        <Text
          style={styles.word}
        >
          {word.word}
        </Text>

        <Text
          style={
            styles.partOfSpeech
          }
        >
          {word.partOfSpeech}
        </Text>

        <Pressable
          onPress={handleSpeak}
          style={({ pressed }) => [
            styles.speakButton,

            pressed &&
              styles.buttonPressed,
          ]}
        >
          <Text
            style={
              styles.speakIcon
            }
          >
            🔊
          </Text>

          <Text
            style={
              styles.speakText
            }
          >
            播放發音
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text
          style={
            styles.sectionLabel
          }
        >
          中文意思
        </Text>

        <Text
          style={styles.meaning}
        >
          {word.meaning}
        </Text>
      </View>

      <View style={styles.section}>
        <Text
          style={
            styles.sectionLabel
          }
        >
          單字情報
        </Text>

        <InfoRow
          name="詞性"
          value={
            word.partOfSpeech ||
            '—'
          }
        />

        <Divider />

        <InfoRow
          name="單字級別"
          value={
            `Level ${word.level}`
          }
        />
      </View>

      <View style={styles.section}>
        <Text
          style={
            styles.sectionLabel
          }
        >
          熟練度
        </Text>

        <View
          style={styles.masteryRow}
        >
          {[1, 2, 3, 4, 5].map(
            (item) => (
              <View
                key={item}
                style={[
                  styles.masteryDot,

                  item <=
                    progress.mastery &&
                    styles.masteryDotActive,
                ]}
              />
            )
          )}
        </View>

        <Text
          style={
            styles.masteryText
          }
        >
          {progress.mastery === 0
            ? '尚未掌握'
            : `熟練度 ${progress.mastery} / 5`}
        </Text>

        <Divider />

        <InfoRow
          name="已複習"
          value={
            `${progress.reviewCount} 次`
          }
        />

        <Divider />

        <InfoRow
          name="答對"
          value={
            `${progress.correctCount} 次`
          }
        />

        <Divider />

        <InfoRow
          name="答錯"
          value={
            `${progress.wrongCount} 次`
          }
        />

        <Divider />

        <InfoRow
          name="正確率"
          value={
            progress.reviewCount > 0
              ? `${accuracy}%`
              : '—'
          }
        />

        <Divider />

        <InfoRow
          name="下次複習"
          value={
            formatNextReview(
              progress.nextReview
            )
          }
        />
      </View>

      <Pressable
        onPress={
          handleFavorite
        }
        style={({ pressed }) => [
          styles.favoriteButton,

          favorite &&
            styles.favoriteButtonActive,

          pressed &&
            styles.buttonPressed,
        ]}
      >
        <Text
          style={
            styles.favoriteIcon
          }
        >
          {favorite
            ? '★'
            : '☆'}
        </Text>

        <Text
          style={[
            styles.favoriteText,

            favorite &&
              styles.favoriteTextActive,
          ]}
        >
          {favorite
            ? '已加入收藏'
            : '加入收藏'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function InfoRow({
  name,
  value,
}) {
  return (
    <View
      style={styles.infoRow}
    >
      <Text
        style={styles.infoName}
      >
        {name}
      </Text>

      <Text
        style={styles.infoValue}
      >
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return (
    <View
      style={styles.divider}
    />
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },

    content: {
      padding: 20,

      paddingBottom: 50,
    },

    hero: {
      alignItems: 'center',

      paddingVertical: 30,
    },

    levelBadge: {
      backgroundColor:
        COLORS.surfaceLight,

      paddingHorizontal: 12,

      paddingVertical: 6,

      borderRadius: 10,

      marginBottom: 18,
    },

    levelText: {
      color: COLORS.primary,

      fontSize: 12,

      fontWeight: '800',

      letterSpacing: 1,
    },

    word: {
      color: COLORS.text,

      fontSize: 42,

      fontWeight: '800',

      textAlign: 'center',
    },

    partOfSpeech: {
      color:
        COLORS.textSecondary,

      fontSize: 17,

      marginTop: 8,
    },

    speakButton: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        COLORS.primary,

      paddingHorizontal: 20,

      paddingVertical: 12,

      borderRadius: 14,

      marginTop: 24,
    },

    speakIcon: {
      fontSize: 17,

      marginRight: 8,
    },

    speakText: {
      color: '#FFFFFF',

      fontSize: 15,

      fontWeight: '700',
    },

    buttonPressed: {
      opacity: 0.7,

      transform: [
        {
          scale: 0.98,
        },
      ],
    },

    section: {
      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 18,

      padding: 18,

      marginBottom: 14,
    },

    sectionLabel: {
      color:
        COLORS.textMuted,

      fontSize: 12,

      fontWeight: '700',

      textTransform:
        'uppercase',

      marginBottom: 12,
    },

    meaning: {
      color: COLORS.text,

      fontSize: 23,

      fontWeight: '600',

      lineHeight: 32,
    },

    infoRow: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      paddingVertical: 4,
    },

    infoName: {
      color:
        COLORS.textSecondary,

      fontSize: 15,
    },

    infoValue: {
      color: COLORS.text,

      fontSize: 15,

      fontWeight: '600',

      maxWidth: '60%',

      textAlign: 'right',
    },

    divider: {
      height: 1,

      backgroundColor:
        COLORS.border,

      marginVertical: 14,
    },

    masteryRow: {
      flexDirection: 'row',

      gap: 10,
    },

    masteryDot: {
      width: 22,

      height: 22,

      borderRadius: 11,

      borderWidth: 2,

      borderColor:
        COLORS.textMuted,
    },

    masteryDotActive: {
      backgroundColor:
        COLORS.primary,

      borderColor:
        COLORS.primary,
    },

    masteryText: {
      color:
        COLORS.textSecondary,

      fontSize: 14,

      marginTop: 12,
    },

    favoriteButton: {
      height: 56,

      flexDirection: 'row',

      justifyContent:
        'center',

      alignItems: 'center',

      borderRadius: 16,

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      marginTop: 6,
    },

    favoriteButtonActive: {
      borderColor:
        COLORS.warning,
    },

    favoriteIcon: {
      color: COLORS.warning,

      fontSize: 25,

      marginRight: 10,
    },

    favoriteText: {
      color: COLORS.text,

      fontSize: 16,

      fontWeight: '700',
    },

    favoriteTextActive: {
      color:
        COLORS.warning,
    },
  });