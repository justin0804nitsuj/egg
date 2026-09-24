import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

import * as Speech from 'expo-speech';

import XpBurst from '../components/XpBurst';

import { WORDS } from '../data/words';
import { COLORS } from '../theme/colors';

import {
  buildReviewSession,
} from '../utils/reviewQueue';

import {
  createEnglishToChineseQuestion,
} from '../utils/quizGenerator';

import {
  successFeedback,
  wrongFeedback,
  comboFeedback,
  getComboBonus,
} from '../utils/gameFeedback';

import {
  recordReview,
  completeSession,
  getLearningStats,
  grantBonusXp,
} from '../storage/progress';

const LEVELS = [1, 2, 3, 4, 5, 6];

const SESSION_SIZE = 10;

export default function MultipleChoiceScreen({
  navigation,
}) {
  const [phase, setPhase] =
    useState('setup');

  const [
    selectedLevel,
    setSelectedLevel,
  ] = useState(null);

  const [
    sessionWords,
    setSessionWords,
  ] = useState([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState(null);

  const [
    answered,
    setAnswered,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    preparing,
    setPreparing,
  ] = useState(false);

  const [
    sessionXp,
    setSessionXp,
  ] = useState(0);

  const [
    totalXp,
    setTotalXp,
  ] = useState(0);

  const [combo, setCombo] =
    useState(0);

  const [
    maxCombo,
    setMaxCombo,
  ] = useState(0);

  const [
    correctCount,
    setCorrectCount,
  ] = useState(0);

  const [
    wrongCount,
    setWrongCount,
  ] = useState(0);

  const [
    burst,
    setBurst,
  ] = useState({
    visible: false,
    amount: 0,
    combo: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const stats =
      await getLearningStats();

    setTotalXp(stats.xp);
  }

  function showXpBurst(
    amount,
    comboValue
  ) {
    setBurst({
      visible: false,
      amount,
      combo: comboValue,
    });

    setTimeout(() => {
      setBurst({
        visible: true,
        amount,
        combo: comboValue,
      });
    }, 20);

    setTimeout(() => {
      setBurst(
        (current) => ({
          ...current,
          visible: false,
        })
      );
    }, 900);
  }

  const currentWord =
    sessionWords[currentIndex];

  const question =
    useMemo(() => {
      if (!currentWord) {
        return null;
      }

      return createEnglishToChineseQuestion(
        currentWord,
        WORDS
      );
    }, [currentWord]);

  async function startQuiz() {
    if (preparing) {
      return;
    }

    setPreparing(true);

    try {
      const words =
        await buildReviewSession({
          words: WORDS,
          selectedLevel,
          size: SESSION_SIZE,
        });

      if (!words.length) {
        return;
      }

      setSessionWords(words);

      setCurrentIndex(0);
      setSelectedAnswer(null);
      setAnswered(false);

      setSessionXp(0);
      setCombo(0);
      setMaxCombo(0);

      setCorrectCount(0);
      setWrongCount(0);

      setBurst({
        visible: false,
        amount: 0,
        combo: 0,
      });

      setPhase('quiz');
    } catch (error) {
      console.error(
        'Failed to start quiz:',
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

  async function handleAnswer(
    option
  ) {
    if (
      answered ||
      submitting ||
      !currentWord
    ) {
      return;
    }

    setSelectedAnswer(
      option.id
    );

    setAnswered(true);
    setSubmitting(true);

    const correct =
      option.correct;

    try {
      const result =
        await recordReview(
          currentWord.id,
          correct
            ? 'good'
            : 'again'
        );

      // recordReview 已先加入基本 XP
      setSessionXp(
        (value) =>
          value +
          result.xpGain
      );

      setTotalXp(
        result.totalXp
      );

      if (correct) {
        await successFeedback();

        setCorrectCount(
          (value) =>
            value + 1
        );

        const nextCombo =
          combo + 1;

        const comboBonus =
          getComboBonus(
            nextCombo
          );

        let finalXp =
          result.xpGain;

        if (comboBonus > 0) {
          const bonusStats =
            await grantBonusXp(
              comboBonus
            );

          finalXp +=
            comboBonus;

          setTotalXp(
            bonusStats.xp
          );

          setSessionXp(
            (value) =>
              value +
              comboBonus
          );

          await comboFeedback(
            nextCombo
          );
        }

        setCombo(
          nextCombo
        );

        setMaxCombo(
          (value) =>
            Math.max(
              value,
              nextCombo
            )
        );

        showXpBurst(
          finalXp,
          nextCombo
        );
      } else {
        await wrongFeedback();

        setWrongCount(
          (value) =>
            value + 1
        );

        setCombo(0);

        showXpBurst(
          result.xpGain,
          0
        );
      }
    } catch (error) {
      console.error(
        'Failed to answer question:',
        error
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function nextQuestion() {
    if (
      !answered ||
      submitting
    ) {
      return;
    }

    const isLast =
      currentIndex ===
      sessionWords.length - 1;

    if (isLast) {
      setSubmitting(true);

      try {
        await completeSession();

        setPhase('result');
      } catch (error) {
        console.error(
          'Failed to complete quiz:',
          error
        );
      } finally {
        setSubmitting(false);
      }

      return;
    }

    setCurrentIndex(
      (value) =>
        value + 1
    );

    setSelectedAnswer(null);
    setAnswered(false);
  }

  const progress =
    sessionWords.length > 0
      ? (
          (currentIndex + 1) /
          sessionWords.length
        ) * 100
      : 0;

  if (phase === 'setup') {
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
        <Text style={styles.eyebrow}>
          MULTIPLE CHOICE
        </Text>

        <Text style={styles.title}>
          英 → 中
        </Text>

        <Text style={styles.subtitle}>
          看英文單字，從四個選項中找出正確中文。
        </Text>

        <View style={styles.ruleCard}>
          <Rule
            icon="✅"
            text="答對 +10 XP"
          />

          <Rule
            icon="❌"
            text="答錯 +2 XP，並提早安排複習"
          />

          <Rule
            icon="🔥"
            text="Combo x3 / x5 / x10 有額外 XP"
          />

          <Rule
            icon="🧠"
            text="題目由 SRS 自動挑選"
          />
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          選擇單字級別
        </Text>

        <View
          style={styles.levelGrid}
        >
          <LevelButton
            label="ALL"
            count={WORDS.length}
            active={
              selectedLevel ===
              null
            }
            onPress={() =>
              setSelectedLevel(
                null
              )
            }
          />

          {LEVELS.map(
            (level) => {
              const count =
                WORDS.filter(
                  (word) =>
                    word.level ===
                    level
                ).length;

              return (
                <LevelButton
                  key={level}
                  label={`LV.${level}`}
                  count={count}
                  active={
                    selectedLevel ===
                    level
                  }
                  onPress={() =>
                    setSelectedLevel(
                      level
                    )
                  }
                />
              );
            }
          )}
        </View>

        <Pressable
          disabled={preparing}
          onPress={startQuiz}
          style={({ pressed }) => [
            styles.startButton,

            preparing &&
              styles.disabled,

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
              ? '載入題目中...'
              : '開始 Quiz'}
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (phase === 'result') {
    const accuracy =
      sessionWords.length > 0
        ? Math.round(
            (
              correctCount /
              sessionWords.length
            ) * 100
          )
        : 0;

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.resultContent
        }
      >
        <Text
          style={styles.resultEmoji}
        >
          {accuracy >= 80
            ? '🏆'
            : accuracy >= 60
            ? '⚔️'
            : '🧠'}
        </Text>

        <Text
          style={styles.resultTitle}
        >
          作戰結束
        </Text>

        <Text
          style={
            styles.resultSubtitle
          }
        >
          英 → 中 Quiz
        </Text>

        <View
          style={
            styles.resultScoreCard
          }
        >
          <Text
            style={
              styles.accuracyValue
            }
          >
            {accuracy}%
          </Text>

          <Text
            style={
              styles.accuracyLabel
            }
          >
            正確率
          </Text>
        </View>

        <View
          style={styles.resultGrid}
        >
          <ResultItem
            value={correctCount}
            label="答對"
            color={
              COLORS.success
            }
          />

          <ResultItem
            value={wrongCount}
            label="答錯"
            color={
              COLORS.danger
            }
          />

          <ResultItem
            value={`x${maxCombo}`}
            label="最高 Combo"
            color={
              COLORS.warning
            }
          />

          <ResultItem
            value={`+${sessionXp}`}
            label="獲得 XP"
            color={
              COLORS.primary
            }
          />
        </View>

        <Text
          style={styles.totalXp}
        >
          TOTAL XP {totalXp}
        </Text>

        <Pressable
          disabled={preparing}
          onPress={startQuiz}
          style={({ pressed }) => [
            styles.startButton,

            preparing &&
              styles.disabled,

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
              ? '載入題目中...'
              : '再來一局'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.goBack()
          }
          style={
            styles.backButton
          }
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            返回作戰區
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  const selectedOption =
    question?.choices.find(
      (option) =>
        option.id ===
        selectedAnswer
    );

  return (
    <View
      style={
        styles.quizContainer
      }
    >
      <XpBurst
        visible={burst.visible}
        amount={burst.amount}
        combo={burst.combo}
      />

      <View
        style={styles.quizHeader}
      >
        <Text
          style={styles.counter}
        >
          {currentIndex + 1}
          {' / '}
          {sessionWords.length}
        </Text>

        <View
          style={
            styles.comboContainer
          }
        >
          <Text
            style={styles.combo}
          >
            🔥 x{combo}
          </Text>

          <Text
            style={styles.sessionXp}
          >
            +{sessionXp} XP
          </Text>
        </View>
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
        style={styles.questionCard}
      >
        <View
          style={
            styles.questionMeta
          }
        >
          <Text
            style={
              styles.questionLevel
            }
          >
            LV.{question?.level}
          </Text>

          <Text
            style={
              styles.questionPos
            }
          >
            {
              question
                ?.partOfSpeech
            }
          </Text>
        </View>

        <Text
          style={
            styles.questionHint
          }
        >
          選出正確的中文意思
        </Text>

        <Text
          style={
            styles.questionWord
          }
        >
          {question?.word}
        </Text>

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
            🔊 發音
          </Text>
        </Pressable>
      </View>

      <View
        style={
          styles.optionsContainer
        }
      >
        {question?.choices.map(
          (option, index) => {
            const selected =
              selectedAnswer ===
              option.id;

            let state =
              'normal';

            if (answered) {
              if (option.correct) {
                state =
                  'correct';
              } else if (
                selected
              ) {
                state =
                  'wrong';
              } else {
                state =
                  'disabled';
              }
            }

            return (
              <QuizOption
                key={`${option.id}-${index}`}
                letter={
                  ['A', 'B', 'C', 'D'][
                    index
                  ]
                }
                text={
                  option.text
                }
                state={state}
                disabled={
                  answered
                }
                onPress={() =>
                  handleAnswer(
                    option
                  )
                }
              />
            );
          }
        )}
      </View>

      {answered && (
        <View
          style={
            styles.feedbackArea
          }
        >
          <Text
            style={[
              styles.feedbackTitle,
              {
                color:
                  selectedOption
                    ?.correct
                    ? COLORS.success
                    : COLORS.danger,
              },
            ]}
          >
            {selectedOption?.correct
              ? '✓ 正確！'
              : '✕ 答錯了'}
          </Text>

          {!selectedOption?.correct && (
            <Text
              style={
                styles.feedbackAnswer
              }
            >
              正確答案：
              {
                question
                  ?.correctMeaning
              }
            </Text>
          )}

          <Pressable
            disabled={submitting}
            onPress={nextQuestion}
            style={({ pressed }) => [
              styles.nextButton,

              submitting &&
                styles.disabled,

              pressed &&
                !submitting &&
                styles.pressed,
            ]}
          >
            <Text
              style={
                styles.nextButtonText
              }
            >
              {currentIndex ===
              sessionWords.length - 1
                ? '查看戰績'
                : '下一題 →'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function Rule({
  icon,
  text,
}) {
  return (
    <View style={styles.ruleRow}>
      <Text
        style={styles.ruleIcon}
      >
        {icon}
      </Text>

      <Text
        style={styles.ruleText}
      >
        {text}
      </Text>
    </View>
  );
}

function LevelButton({
  label,
  count,
  active,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.levelButton,

        active &&
          styles.levelButtonActive,
      ]}
    >
      <Text
        style={[
          styles.levelLabel,

          active &&
            styles.levelLabelActive,
        ]}
      >
        {label}
      </Text>

      <Text
        style={styles.levelCount}
      >
        {count}
      </Text>
    </Pressable>
  );
}

function QuizOption({
  letter,
  text,
  state,
  disabled,
  onPress,
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,

        state === 'correct' &&
          styles.optionCorrect,

        state === 'wrong' &&
          styles.optionWrong,

        state === 'disabled' &&
          styles.optionDisabled,

        pressed &&
          !disabled &&
          styles.pressed,
      ]}
    >
      <View
        style={[
          styles.optionLetter,

          state === 'correct' &&
            styles.optionLetterCorrect,

          state === 'wrong' &&
            styles.optionLetterWrong,
        ]}
      >
        <Text
          style={
            styles.optionLetterText
          }
        >
          {state === 'correct'
            ? '✓'
            : state === 'wrong'
            ? '✕'
            : letter}
        </Text>
      </View>

      <Text
        style={styles.optionText}
      >
        {text}
      </Text>
    </Pressable>
  );
}

function ResultItem({
  value,
  label,
  color,
}) {
  return (
    <View
      style={styles.resultItem}
    >
      <Text
        style={[
          styles.resultItemValue,
          { color },
        ]}
      >
        {value}
      </Text>

      <Text
        style={
          styles.resultItemLabel
        }
      >
        {label}
      </Text>
    </View>
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
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 10,
  },

  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: '800',
    marginTop: 5,
  },

  subtitle: {
    color:
      COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  ruleCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 18,
    padding: 16,
    marginTop: 22,
    gap: 12,
  },

  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ruleIcon: {
    width: 32,
    fontSize: 17,
  },

  ruleText: {
    color:
      COLORS.textSecondary,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 26,
    marginBottom: 12,
  },

  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  levelButton: {
    width: '31%',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
  },

  levelButtonActive: {
    borderColor:
      COLORS.primary,
    backgroundColor:
      COLORS.surfaceLight,
  },

  levelLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },

  levelLabelActive: {
    color: COLORS.primary,
  },

  levelCount: {
    color:
      COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
  },

  startButton: {
    height: 58,
    backgroundColor:
      COLORS.primary,
    borderRadius: 17,
    justifyContent:
      'center',
    alignItems: 'center',
    marginTop: 28,
  },

  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  disabled: {
    opacity: 0.5,
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  quizContainer: {
    flex: 1,
    backgroundColor:
      COLORS.background,
    padding: 20,
  },

  quizHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  counter: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },

  comboContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  combo: {
    color: COLORS.warning,
    fontWeight: '800',
    fontSize: 14,
  },

  sessionXp: {
    color: COLORS.success,
    fontWeight: '800',
    fontSize: 13,
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

  questionCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 24,
    padding: 22,
    marginTop: 24,
    alignItems: 'center',
  },

  questionMeta: {
    width: '100%',
    flexDirection: 'row',
    justifyContent:
      'space-between',
  },

  questionLevel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
  },

  questionPos: {
    color:
      COLORS.textMuted,
    fontSize: 12,
  },

  questionHint: {
    color:
      COLORS.textMuted,
    fontSize: 12,
    marginTop: 28,
  },

  questionWord: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
  },

  speakButton: {
    backgroundColor:
      COLORS.surfaceLight,
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginTop: 22,
  },

  speakText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  optionsContainer: {
    gap: 10,
    marginTop: 18,
  },

  option: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 17,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  optionCorrect: {
    borderColor:
      COLORS.success,
    backgroundColor:
      `${COLORS.success}18`,
  },

  optionWrong: {
    borderColor:
      COLORS.danger,
    backgroundColor:
      `${COLORS.danger}18`,
  },

  optionDisabled: {
    opacity: 0.45,
  },

  optionLetter: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor:
      COLORS.surfaceLight,
    justifyContent:
      'center',
    alignItems: 'center',
    marginRight: 13,
  },

  optionLetterCorrect: {
    backgroundColor:
      COLORS.success,
  },

  optionLetterWrong: {
    backgroundColor:
      COLORS.danger,
  },

  optionLetterText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '800',
  },

  optionText: {
    color: COLORS.text,
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },

  feedbackArea: {
    marginTop: 16,
    paddingBottom: 10,
  },

  feedbackTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
  },

  feedbackAnswer: {
    color:
      COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    fontSize: 14,
  },

  nextButton: {
    height: 52,
    backgroundColor:
      COLORS.primary,
    justifyContent:
      'center',
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 14,
  },

  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  resultContent: {
    padding: 24,
    paddingTop: 50,
    alignItems: 'center',
  },

  resultEmoji: {
    fontSize: 60,
  },

  resultTitle: {
    color: COLORS.text,
    fontSize: 31,
    fontWeight: '900',
    marginTop: 14,
  },

  resultSubtitle: {
    color:
      COLORS.textSecondary,
    marginTop: 6,
  },

  resultScoreCard: {
    alignItems: 'center',
    marginTop: 30,
  },

  accuracyValue: {
    color: COLORS.primary,
    fontSize: 56,
    fontWeight: '900',
  },

  accuracyLabel: {
    color:
      COLORS.textMuted,
    marginTop: 3,
  },

  resultGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
    gap: 10,
    marginTop: 28,
  },

  resultItem: {
    width: '48%',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 17,
    paddingVertical: 18,
    alignItems: 'center',
  },

  resultItemValue: {
    fontSize: 25,
    fontWeight: '900',
  },

  resultItemLabel: {
    color:
      COLORS.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  totalXp: {
    color:
      COLORS.textMuted,
    marginTop: 22,
    fontSize: 13,
    fontWeight: '700',
  },

  backButton: {
    paddingVertical: 16,
  },

  backButtonText: {
    color:
      COLORS.textSecondary,
    fontWeight: '600',
  },
});