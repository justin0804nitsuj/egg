import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';

import * as Speech from 'expo-speech';

import { WORDS } from '../data/words';
import { COLORS } from '../theme/colors';

import {
  recordReview,
  completeSession,
  getLearningStats,
} from '../storage/progress';

import {
  buildReviewSession,
} from '../utils/reviewQueue';

import {
  isAllLevelsSelected,
  isSelectedLevel,
  wordHasLevel,
} from '../utils/wordLevels';

import {
  tapFeedback,
  successFeedback,
  wrongFeedback,
} from '../utils/gameFeedback';

const LEVELS = [1, 2, 3, 4, 5, 6];

const SESSION_SIZE = 10;

export default function FlashcardScreen() {
  const flipAnim =
    useMemo(
      () =>
        new Animated.Value(0),
      []
    );

  const [
    selectedLevel,
    setSelectedLevel,
  ] = useState(null);

  const [
    phase,
    setPhase,
  ] = useState('setup');

  const [
    sessionWords,
    setSessionWords,
  ] = useState([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    revealed,
    setRevealed,
  ] = useState(false);

  const [
    sessionXp,
    setSessionXp,
  ] = useState(0);

  const [
    totalXp,
    setTotalXp,
  ] = useState(0);

  const [
    preparing,
    setPreparing,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    results,
    setResults,
  ] = useState({
    again: 0,
    hard: 0,
    good: 0,
  });

  useEffect(() => {
    let active = true;

    async function loadStats() {
      const stats =
        await getLearningStats();

      if (active) {
        setTotalXp(stats.xp);
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  const currentWord =
    sessionWords[currentIndex];

  const frontRotateY =
    useMemo(
      () =>
        flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [
            '0deg',
            '180deg',
          ],
        }),
      [flipAnim]
    );

  const backRotateY =
    useMemo(
      () =>
        flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [
            '180deg',
            '360deg',
          ],
        }),
      [flipAnim]
    );

  const frontOpacity =
    useMemo(
      () =>
        flipAnim.interpolate({
          inputRange: [
            0,
            0.49,
            0.5,
            1,
          ],

          outputRange: [
            1,
            1,
            0,
            0,
          ],
        }),
      [flipAnim]
    );

  const backOpacity =
    useMemo(
      () =>
        flipAnim.interpolate({
          inputRange: [
            0,
            0.49,
            0.5,
            1,
          ],

          outputRange: [
            0,
            0,
            1,
            1,
          ],
        }),
      [flipAnim]
    );

  function resetCardFlip() {
    flipAnim.stopAnimation();

    flipAnim.setValue(0);

    setRevealed(false);
  }

  function revealCard() {
    if (revealed) {
      return;
    }

    tapFeedback();

    setRevealed(true);

    Animated.spring(
      flipAnim,
      {
        toValue: 1,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }
    ).start();
  }

  async function startSession() {
    if (preparing) {
      return;
    }

    setPreparing(true);

    try {
      const selected =
        await buildReviewSession({
          words: WORDS,
          selectedLevel,
          size: SESSION_SIZE,
        });

      if (!selected.length) {
        return;
      }

      setSessionWords(
        selected
      );

      setCurrentIndex(0);

      flipAnim.setValue(0);

      setRevealed(false);

      setSessionXp(0);

      setResults({
        again: 0,
        hard: 0,
        good: 0,
      });

      setPhase('study');
    } catch (error) {
      console.error(
        'Failed to create review session:',
        error
      );
    } finally {
      setPreparing(false);
    }
  }

  function speakWord() {
    if (!currentWord) {
      return;
    }

    Speech.stop();

    Speech.speak(
      currentWord.word,
      {
        language: 'en-US',
        rate: 0.85,
        pitch: 1,
      }
    );
  }

  async function handleRating(
    rating
  ) {
    if (
      !currentWord ||
      submitting ||
      !revealed
    ) {
      return;
    }

    setSubmitting(true);

    try {
      const result =
        await recordReview(
          currentWord.id,
          rating
        );

      if (rating === 'good') {
        await successFeedback();
      } else if (
        rating === 'again'
      ) {
        await wrongFeedback();
      } else {
        await tapFeedback();
      }

      setSessionXp(
        (value) =>
          value +
          result.xpGain
      );

      setTotalXp(
        result.totalXp
      );

      setResults(
        (current) => ({
          ...current,

          [rating]:
            current[rating] + 1,
        })
      );

      const isLastWord =
        currentIndex ===
        sessionWords.length - 1;

      if (isLastWord) {
        await completeSession();

        setPhase('result');

        return;
      }

      setCurrentIndex(
        (value) =>
          value + 1
      );

      resetCardFlip();
    } catch (error) {
      console.error(
        'Failed to record review:',
        error
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetSession() {
    setPhase('setup');

    setSessionWords([]);

    setCurrentIndex(0);

    flipAnim.setValue(0);

    setRevealed(false);

    setSubmitting(false);
  }

  if (phase === 'setup') {
    const allLevelsSelected =
      isAllLevelsSelected(selectedLevel);

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.setupContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text
          style={styles.eyebrow}
        >
          TRAINING AREA
        </Text>

        <Text
          style={styles.title}
        >
          Flashcard
        </Text>

        <Text
          style={styles.subtitle}
        >
          選擇單字級別，開始一場 10 題訓練。
        </Text>

        <View
          style={styles.xpCard}
        >
          <Text
            style={styles.xpLabel}
          >
            CURRENT XP
          </Text>

          <Text
            style={styles.xpValue}
          >
            {totalXp}
          </Text>

          <Text
            style={styles.xpUnit}
          >
            XP
          </Text>
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          選擇作戰區域
        </Text>

        <View
          style={styles.levelGrid}
        >
          <Pressable
            onPress={() =>
              setSelectedLevel(null)
            }
            style={[
              styles.levelCard,

              allLevelsSelected &&
                styles.levelCardActive,
            ]}
          >
            <Text
              style={[
                styles.levelNumber,

                allLevelsSelected &&
                  styles.levelTextActive,
              ]}
            >
              ALL
            </Text>

            <Text
              style={
                styles.levelCount
              }
            >
              {WORDS.length} words
            </Text>
          </Pressable>

          {LEVELS.map(
            (level) => {
              const count =
                WORDS.filter(
                  (word) =>
                    wordHasLevel(
                      word,
                      level
                    )
                ).length;

              const active =
                isSelectedLevel(
                  selectedLevel,
                  level
                );

              return (
                <Pressable
                  key={level}
                  onPress={() =>
                    setSelectedLevel(
                      level
                    )
                  }
                  style={[
                    styles.levelCard,

                    active &&
                      styles.levelCardActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.levelNumber,

                      active &&
                        styles.levelTextActive,
                    ]}
                  >
                    LV.{level}
                  </Text>

                  <Text
                    style={
                      styles.levelCount
                    }
                  >
                    {count} words
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        <Pressable
          disabled={preparing}
          onPress={startSession}
          style={({ pressed }) => [
            styles.startButton,

            preparing &&
              styles.startButtonDisabled,

            pressed &&
              !preparing &&
              styles.pressed,
          ]}
        >
          <Text
            style={
              styles.startButtonText
            }
          >
            {preparing
              ? '整備中...'
              : '開始作戰'}
          </Text>
        </Pressable>

        <Text
          style={styles.queueHint}
        >
          系統會優先安排已到複習時間、
          熟練度較低或曾答錯的單字。
        </Text>
      </ScrollView>
    );
  }

  if (phase === 'result') {
    return (
      <View
        style={[
          styles.container,
          styles.resultContainer,
        ]}
      >
        <Text
          style={styles.resultEmoji}
        >
          ⚡
        </Text>

        <Text
          style={styles.resultTitle}
        >
          作戰完成
        </Text>

        <Text
          style={
            styles.resultSubtitle
          }
        >
          這一輪完成了{' '}
          {sessionWords.length}{' '}
          個單字
        </Text>

        <View
          style={
            styles.resultXpCard
          }
        >
          <Text
            style={
              styles.resultXpLabel
            }
          >
            獲得
          </Text>

          <Text
            style={styles.resultXp}
          >
            +{sessionXp}
          </Text>

          <Text
            style={
              styles.resultXpUnit
            }
          >
            XP
          </Text>
        </View>

        <View
          style={styles.summaryRow}
        >
          <View
            style={styles.summaryItem}
          >
            <Text
              style={[
                styles.summaryValue,
                {
                  color:
                    COLORS.danger,
                },
              ]}
            >
              {results.again}
            </Text>

            <Text
              style={
                styles.summaryLabel
              }
            >
              不會
            </Text>
          </View>

          <View
            style={styles.summaryItem}
          >
            <Text
              style={[
                styles.summaryValue,
                {
                  color:
                    COLORS.warning,
                },
              ]}
            >
              {results.hard}
            </Text>

            <Text
              style={
                styles.summaryLabel
              }
            >
              有點熟
            </Text>
          </View>

          <View
            style={styles.summaryItem}
          >
            <Text
              style={[
                styles.summaryValue,
                {
                  color:
                    COLORS.success,
                },
              ]}
            >
              {results.good}
            </Text>

            <Text
              style={
                styles.summaryLabel
              }
            >
              會了
            </Text>
          </View>
        </View>

        <Text
          style={styles.totalXp}
        >
          總 XP：{totalXp}
        </Text>

        <Pressable
          disabled={preparing}
          onPress={startSession}
          style={({ pressed }) => [
            styles.startButton,

            preparing &&
              styles.startButtonDisabled,

            pressed &&
              !preparing &&
              styles.pressed,
          ]}
        >
          <Text
            style={
              styles.startButtonText
            }
          >
            {preparing
              ? '整備中...'
              : '再來一局'}
          </Text>
        </Pressable>

        <Pressable
          onPress={resetSession}
          style={
            styles.secondaryButton
          }
        >
          <Text
            style={
              styles.secondaryButtonText
            }
          >
            返回作戰選單
          </Text>
        </Pressable>
      </View>
    );
  }

  const progress =
    sessionWords.length > 0
      ? (
          (currentIndex + 1) /
          sessionWords.length
        ) * 100
      : 0;

  return (
    <View
      style={
        styles.studyContainer
      }
    >
      <View
        style={styles.studyHeader}
      >
        <Text
          style={
            styles.questionCount
          }
        >
          {currentIndex + 1}
          {' / '}
          {sessionWords.length}
        </Text>

        <Text
          style={styles.sessionXp}
        >
          +{sessionXp} XP
        </Text>
      </View>

      <View
        style={
          styles.progressTrack
        }
      >
        <View
          style={[
            styles.progressFill,
            {
              width:
                `${progress}%`,
            },
          ]}
        />
      </View>

      <View
        style={styles.cardArea}
      >
        <Pressable
          onPress={revealCard}
          style={({ pressed }) => [
            styles.cardPressable,

            pressed &&
              styles.pressed,
          ]}
        >
          <View
            style={
              styles.flipContainer
            }
          >
            <Animated.View
              style={[
                styles.flashcard,
                styles.cardFace,

                {
                  opacity:
                    frontOpacity,

                  transform: [
                    {
                      perspective:
                        1000,
                    },

                    {
                      rotateY:
                        frontRotateY,
                    },
                  ],
                },
              ]}
            >
              <View
                style={
                  styles.cardTop
                }
              >
                <Text
                  style={
                    styles.cardLevel
                  }
                >
                  LV.
                  {
                    currentWord
                      ?.level
                  }
                </Text>

                <Text
                  style={
                    styles.cardPos
                  }
                >
                  {
                    currentWord
                      ?.partOfSpeech
                  }
                </Text>
              </View>

              <Text
                style={
                  styles.cardWord
                }
              >
                {
                  currentWord
                    ?.word
                }
              </Text>

              <Text
                style={
                  styles.tapHint
                }
              >
                點一下翻牌
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.flashcard,
                styles.cardFace,

                {
                  opacity:
                    backOpacity,

                  transform: [
                    {
                      perspective:
                        1000,
                    },

                    {
                      rotateY:
                        backRotateY,
                    },
                  ],
                },
              ]}
            >
              <View
                style={
                  styles.cardTop
                }
              >
                <Text
                  style={
                    styles.cardLevel
                  }
                >
                  LV.
                  {
                    currentWord
                      ?.level
                  }
                </Text>

                <Text
                  style={
                    styles.cardPos
                  }
                >
                  {
                    currentWord
                      ?.partOfSpeech
                  }
                </Text>
              </View>

              <Text
                style={
                  styles.cardWordBack
                }
              >
                {
                  currentWord
                    ?.word
                }
              </Text>

              <View
                style={
                  styles.answerDivider
                }
              />

              <Text
                style={
                  styles.answerLabel
                }
              >
                中文意思
              </Text>

              <Text
                style={
                  styles.cardMeaning
                }
              >
                {
                  currentWord
                    ?.meaning
                }
              </Text>
            </Animated.View>
          </View>
        </Pressable>

        <Pressable
          onPress={speakWord}
          style={({ pressed }) => [
            styles.speakButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <Text
            style={styles.speakText}
          >
            🔊 播放發音
          </Text>
        </Pressable>
      </View>

      {revealed && (
        <View
          style={styles.ratingArea}
        >
          <Text
            style={
              styles.ratingTitle
            }
          >
            你記得這個單字嗎？
          </Text>

          <View
            style={styles.ratingRow}
          >
            <RatingButton
              emoji="😵"
              title="不會"
              xp="+2 XP"
              disabled={submitting}
              style={
                styles.againButton
              }
              onPress={() =>
                handleRating(
                  'again'
                )
              }
            />

            <RatingButton
              emoji="🤔"
              title="有點熟"
              xp="+5 XP"
              disabled={submitting}
              style={
                styles.hardButton
              }
              onPress={() =>
                handleRating(
                  'hard'
                )
              }
            />

            <RatingButton
              emoji="😎"
              title="會了"
              xp="+10 XP"
              disabled={submitting}
              style={
                styles.goodButton
              }
              onPress={() =>
                handleRating(
                  'good'
                )
              }
            />
          </View>
        </View>
      )}
    </View>
  );
}

function RatingButton({
  emoji,
  title,
  xp,
  disabled,
  style,
  onPress,
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.ratingButton,

        style,

        disabled &&
          styles.ratingDisabled,

        pressed &&
          !disabled &&
          styles.pressed,
      ]}
    >
      <Text
        style={
          styles.ratingEmoji
        }
      >
        {emoji}
      </Text>

      <Text
        style={
          styles.ratingButtonText
        }
      >
        {title}
      </Text>

      <Text
        style={styles.ratingXp}
      >
        {xp}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  setupContent: {
    padding: 20,
    paddingBottom: 50,
  },

  eyebrow: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 10,
  },

  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: '800',
    marginTop: 6,
  },

  subtitle: {
    color:
      COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  xpCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
  },

  xpLabel: {
    color:
      COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginRight: 'auto',
  },

  xpValue: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: '800',
  },

  xpUnit: {
    color:
      COLORS.textSecondary,
    fontSize: 13,
    marginLeft: 6,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 14,
  },

  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  levelCard: {
    width: '31%',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },

  levelCardActive: {
    borderColor:
      COLORS.primary,
    backgroundColor:
      COLORS.surfaceLight,
  },

  levelNumber: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },

  levelTextActive: {
    color: COLORS.primary,
  },

  levelCount: {
    color:
      COLORS.textMuted,
    fontSize: 11,
    marginTop: 5,
  },

  startButton: {
    height: 58,
    justifyContent:
      'center',
    alignItems: 'center',
    backgroundColor:
      COLORS.primary,
    borderRadius: 17,
    marginTop: 28,
  },

  startButtonDisabled: {
    opacity: 0.55,
  },

  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  queueHint: {
    color:
      COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },

  pressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  studyContainer: {
    flex: 1,
    backgroundColor:
      COLORS.background,
    padding: 20,
  },

  studyHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  questionCount: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },

  sessionXp: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '800',
  },

  progressTrack: {
    height: 6,
    backgroundColor:
      COLORS.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },

  progressFill: {
    height: '100%',
    backgroundColor:
      COLORS.primary,
  },

  cardArea: {
    flex: 1,
    justifyContent:
      'center',
  },

  cardPressable: {
    width: '100%',
  },

  flipContainer: {
    height: 330,
    position: 'relative',
  },

  cardFace: {
    ...StyleSheet.absoluteFillObject,

    backfaceVisibility:
      'hidden',
  },

  flashcard: {
    justifyContent:
      'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 26,
    padding: 28,
  },

  cardTop: {
    position: 'absolute',
    top: 28,
    left: 28,
    right: 28,

    flexDirection: 'row',

    justifyContent:
      'space-between',
  },

  cardLevel: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },

  cardPos: {
    color:
      COLORS.textMuted,
    fontSize: 13,
  },

  cardWord: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: '800',
    textAlign: 'center',
  },

  cardWordBack: {
    color: COLORS.text,
    fontSize: 29,
    fontWeight: '800',
    textAlign: 'center',
  },

  tapHint: {
    color:
      COLORS.textMuted,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 45,
  },

  answerDivider: {
    height: 1,
    backgroundColor:
      COLORS.border,
    marginVertical: 24,
  },

  answerLabel: {
    color:
      COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },

  cardMeaning: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 34,
    textAlign: 'center',
    marginTop: 12,
  },

  speakButton: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor:
      COLORS.surfaceLight,
    borderRadius: 14,
    marginTop: 18,
  },

  speakText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  ratingArea: {
    paddingBottom: 10,
  },

  ratingTitle: {
    color:
      COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 12,
  },

  ratingRow: {
    flexDirection: 'row',
    gap: 8,
  },

  ratingButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 13,
    borderWidth: 1,
  },

  ratingDisabled: {
    opacity: 0.45,
  },

  againButton: {
    backgroundColor:
      `${COLORS.danger}15`,
    borderColor:
      COLORS.danger,
  },

  hardButton: {
    backgroundColor:
      `${COLORS.warning}15`,
    borderColor:
      COLORS.warning,
  },

  goodButton: {
    backgroundColor:
      `${COLORS.success}15`,
    borderColor:
      COLORS.success,
  },

  ratingEmoji: {
    fontSize: 20,
  },

  ratingButtonText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },

  ratingXp: {
    color:
      COLORS.textMuted,
    fontSize: 10,
    marginTop: 3,
  },

  resultContainer: {
    justifyContent:
      'center',
    alignItems: 'center',
    padding: 26,
  },

  resultEmoji: {
    fontSize: 60,
  },

  resultTitle: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '800',
    marginTop: 18,
  },

  resultSubtitle: {
    color:
      COLORS.textSecondary,
    fontSize: 15,
    marginTop: 8,
  },

  resultXpCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 28,
  },

  resultXpLabel: {
    color:
      COLORS.textMuted,
    fontSize: 14,
    marginRight: 10,
  },

  resultXp: {
    color: COLORS.success,
    fontSize: 46,
    fontWeight: '800',
  },

  resultXpUnit: {
    color:
      COLORS.textSecondary,
    marginLeft: 7,
  },

  summaryRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent:
      'space-around',
    backgroundColor:
      COLORS.surface,
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: 28,
  },

  summaryItem: {
    alignItems: 'center',
  },

  summaryValue: {
    fontSize: 26,
    fontWeight: '800',
  },

  summaryLabel: {
    color:
      COLORS.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },

  totalXp: {
    color:
      COLORS.textSecondary,
    fontSize: 14,
    marginTop: 20,
  },

  secondaryButton: {
    paddingVertical: 16,
  },

  secondaryButtonText: {
    color:
      COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
