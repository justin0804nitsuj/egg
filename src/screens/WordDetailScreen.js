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
  Alert,
  Linking,
  Platform,
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

import {
  getWordDefinitions,
} from '../data/wordDefinitions';

import {
  DICTIONARY_SOURCES,
  buildCambridgeTraditionalUrl,
} from '../data/dictionarySources';

const DEFAULT_PROGRESS = {
  mastery: 0,

  reviewCount: 0,
  correctCount: 0,
  wrongCount: 0,

  intervalDays: 0,

  lastReviewed: null,
  nextReview: null,
};

function groupDefinitionsByPartOfSpeech(
  definitions
) {
  const groups = [];
  const groupsByPos = new Map();

  definitions.forEach(
    (definition) => {
      const key =
        definition.partOfSpeechLabel ||
        definition.partOfSpeech ||
        'other';

      if (!groupsByPos.has(key)) {
        const group = {
          label: key,
          definitions: [],
        };

        groupsByPos.set(
          key,
          group
        );

        groups.push(group);
      }

      groupsByPos
        .get(key)
        .definitions.push(
          definition
        );
    }
  );

  return groups;
}

function isOfflineForExternalLookup() {
  return (
    Platform.OS === 'web' &&
    globalThis.navigator
      ?.onLine === false
  );
}

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

  const dictionaryEntry =
    getWordDefinitions(
      word.id
    );

  const definitionGroups =
    groupDefinitionsByPartOfSpeech(
      dictionaryEntry
        ?.definitions ?? []
    );

  const cambridgeUrl =
    buildCambridgeTraditionalUrl(
      word.word
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

  async function handleOpenCambridge() {
    if (
      isOfflineForExternalLookup()
    ) {
      Alert.alert(
        '需要網路連線',
        'Cambridge 英漢繁體字典是外部線上查詢，離線時無法開啟。'
      );

      return;
    }

    try {
      await Linking.openURL(
        cambridgeUrl
      );
    } catch (error) {
      console.warn(
        'Unable to open Cambridge dictionary:',
        error
      );

      Alert.alert(
        '無法開啟連結',
        '請稍後再試，或確認裝置的瀏覽器設定。'
      );
    }
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
        <View
          style={
            styles.dictionaryHeaderRow
          }
        >
          <Text
            style={
              styles.sectionLabel
            }
          >
            WordNet 詞義
          </Text>

          <Text
            style={
              styles.sourceBadge
            }
          >
            OEWN 2025
          </Text>
        </View>

        {definitionGroups.length > 0 ? (
          definitionGroups.map(
            (group) => (
              <DefinitionGroup
                key={group.label}
                group={group}
              />
            )
          )
        ) : (
          <Text
            style={
              styles.emptyDictionaryText
            }
          >
            尚未匹配 WordNet 詞義。
          </Text>
        )}

        <Pressable
          onPress={
            handleOpenCambridge
          }
          style={({ pressed }) => [
            styles.cambridgeButton,

            pressed &&
              styles.buttonPressed,
          ]}
        >
          <Text
            style={
              styles.cambridgeButtonText
            }
          >
            開啟 Cambridge 英漢繁體
          </Text>
        </Pressable>

        <Text
          style={
            styles.attributionText
          }
        >
          {DICTIONARY_SOURCES
            .openEnglishWordNet
            .name}{' '}
          2025, CC BY 4.0;
          derived from Princeton
          WordNet. Cambridge is an
          online lookup only.
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

function DefinitionGroup({
  group,
}) {
  return (
    <View
      style={styles.senseGroup}
    >
      <Text
        style={styles.senseGroupTitle}
      >
        {group.label}
      </Text>

      {group.definitions.map(
        (definition) => (
          <View
            key={definition.id}
            style={styles.senseItem}
          >
            <Text
              style={
                styles.senseDefinition
              }
            >
              {definition.definition}
            </Text>

            <Text
              style={
                styles.pendingText
              }
            >
              {definition.meaningZh
                ? definition.meaningZh
                : '中文翻譯待審核'}
            </Text>

            <Text
              style={styles.sourceText}
            >
              {definition.synsetId}
              {' · '}
              {definition.lexicalFile}
            </Text>
          </View>
        )
      )}
    </View>
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

    dictionaryHeaderRow: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      marginBottom: 6,
    },

    sourceBadge: {
      color: COLORS.primary,

      fontSize: 11,

      fontWeight: '800',

      backgroundColor:
        COLORS.surfaceLight,

      paddingHorizontal: 8,

      paddingVertical: 4,

      borderRadius: 8,
    },

    meaning: {
      color: COLORS.text,

      fontSize: 23,

      fontWeight: '600',

      lineHeight: 32,
    },

    senseGroup: {
      marginTop: 10,
    },

    senseGroupTitle: {
      color: COLORS.primary,

      fontSize: 13,

      fontWeight: '800',

      textTransform:
        'uppercase',
    },

    senseItem: {
      borderTopWidth: 1,

      borderTopColor:
        COLORS.border,

      paddingTop: 12,

      marginTop: 12,
    },

    senseDefinition: {
      color: COLORS.text,

      fontSize: 15,

      fontWeight: '600',

      lineHeight: 22,
    },

    pendingText: {
      color:
        COLORS.textSecondary,

      fontSize: 13,

      lineHeight: 19,

      marginTop: 6,
    },

    sourceText: {
      color: COLORS.textMuted,

      fontSize: 11,

      marginTop: 7,
    },

    emptyDictionaryText: {
      color:
        COLORS.textSecondary,

      fontSize: 14,

      lineHeight: 20,
    },

    cambridgeButton: {
      minHeight: 48,

      justifyContent:
        'center',

      alignItems: 'center',

      backgroundColor:
        COLORS.surfaceLight,

      borderWidth: 1,

      borderColor:
        COLORS.primary,

      borderRadius: 14,

      marginTop: 16,

      paddingHorizontal: 12,
    },

    cambridgeButtonText: {
      color: COLORS.primary,

      fontSize: 14,

      fontWeight: '800',

      textAlign: 'center',
    },

    attributionText: {
      color: COLORS.textMuted,

      fontSize: 11,

      lineHeight: 16,

      marginTop: 12,
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
