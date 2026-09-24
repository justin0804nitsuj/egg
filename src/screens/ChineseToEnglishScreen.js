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
  createChineseToEnglishQuestion,
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

export default function ChineseToEnglishScreen({
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
    preparing,
    setPreparing,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
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

      return createChineseToEnglishQuestion(
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
        'Failed to start Chinese → English quiz:',
        error
      );
    } finally {
      setPreparing(false);
    }
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
        'Failed to answer:',
        error
      );
    } finally {
      setSubmitting(false);
    }
  }

  function speakCorrectWord() {
    if (!question) {
      return;
    }

    Speech.stop();

    Speech.speak(
      question.correctWord,
      {
        language: 'en-US',
        rate: 0.85,
        pitch: 1,
      }
    );
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
          'Failed to complete session:',
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
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text style={styles.eyebrow}>
          REVERSE QUIZ
        </Text>

        <Text style={styles.title}>
          中 → 英
        </Text>

        <Text style={styles.subtitle}>
          根據中文意思，找出正確的英文單字。
        </Text>

        <View
          style={styles.infoCard}
        >
          <Text
            style={styles.infoText}
          >
            🎯 答對 +10 XP
          </Text>

          <Text
            style={styles.infoText}
          >
            ❌ 答錯 +2 XP
          </Text>

          <Text
            style={styles.infoText}
          >
            🔥 Combo 可獲得額外 XP
          </Text>

          <Text
            style={styles.infoText}
          >
            🧠 題目由 SRS 自動挑選
          </Text>
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
            active={
              selectedLevel === null
            }
            count={WORDS.length}
            onPress={() =>
              setSelectedLevel(null)
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
            styles.mainButton,

            preparing &&
              styles.disabled,

            pressed &&
              !preparing &&
              styles.pressed,
          ]}
        >
          <Text
            style={
              styles.mainButtonText
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
          style={
            styles.resultEmoji
          }
        >
          {accuracy >= 80
            ? '🏆'
            : accuracy >= 60
            ? '⚔️'
            : '🧠'}
        </Text>

        <Text
          style={
            styles.resultTitle
          }
        >
          作戰結束
        </Text>

        <Text
          style={styles.accuracy}
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

        <View
          style={styles.resultGrid}
        >
          <ResultCard
            label="答對"
            value={correctCount}
            color={
              COLORS.success
            }
          />

          <ResultCard
            label="答錯"
            value={wrongCount}
            color={
              COLORS.danger
            }
          />

          <ResultCard
            label="最高 Combo"
            value={`x${maxCombo}`}
            color={
              COLORS.warning
            }
          />

          <ResultCard
            label="獲得 XP"
            value={`+${sessionXp}`}
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
            styles.mainButton,

            preparing &&
              styles.disabled,

            pressed &&
              !preparing &&
              styles.pressed,
          ]}
        >
          <Text
            style={
              styles.mainButtonText
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
          style={styles.backButton}
        >
          <Text
            style={
              styles.backText
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
      (item) =>
        item.id ===
        selectedAnswer
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.quizContent
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <XpBurst
        visible={burst.visible}
        amount={burst.amount}
        combo={burst.combo}
      />

      <View style={styles.header}>
        <Text style={styles.counter}>
          {currentIndex + 1}
          {' / '}
          {sessionWords.length}
        </Text>

        <Text style={styles.combo}>
          🔥 x{combo}
        </Text>

        <Text
          style={styles.sessionXp}
        >
          +{sessionXp} XP
        </Text>
      </View>

      <View
        style={styles.progressTrack}
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
        style={
          styles.questionCard
        }
      >
        <View
          style={styles.meta}
        >
          <Text
            style={styles.level}
          >
            LV.{question?.level}
          </Text>

          <Text style={styles.pos}>
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
          哪個英文符合這個意思？
        </Text>

        <Text
          style={styles.meaning}
        >
          {question?.meaning}
        </Text>
      </View>

      <View
        style={
          styles.optionContainer
        }
      >
        {question?.choices.map(
          (option, index) => {
            let state = 'normal';

            if (answered) {
              if (option.correct) {
                state = 'correct';
              } else if (
                option.id ===
                selectedAnswer
              ) {
                state = 'wrong';
              } else {
                state = 'disabled';
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
                text={option.text}
                state={state}
                disabled={answered}
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
          style={styles.feedback}
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
                styles.correctAnswer
              }
            >
              正確答案：
              {question?.correctWord}
            </Text>
          )}

          <Pressable
            onPress={
              speakCorrectWord
            }
            style={
              styles.speakButton
            }
          >
            <Text
              style={
                styles.speakText
              }
            >
              🔊 聽正確發音
            </Text>
          </Pressable>

          <Pressable
            disabled={submitting}
            onPress={
              nextQuestion
            }
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
    </ScrollView>
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
          styles.levelActive,
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
            styles.correctLetter,

          state === 'wrong' &&
            styles.wrongLetter,
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

function ResultCard({
  label,
  value,
  color,
}) {
  return (
    <View
      style={styles.resultCard}
    >
      <Text
        style={[
          styles.resultValue,
          { color },
        ]}
      >
        {value}
      </Text>

      <Text
        style={
          styles.resultLabel
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

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  eyebrow: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 2,
  },

  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color:
      COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 7,
  },

  infoCard: {
    backgroundColor:
      COLORS.surface,
    borderColor:
      COLORS.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 11,
    marginTop: 22,
  },

  infoText: {
    color:
      COLORS.textSecondary,
    fontSize: 13,
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

  levelActive: {
    borderColor:
      COLORS.primary,
    backgroundColor:
      COLORS.surfaceLight,
  },

  levelLabel: {
    color: COLORS.text,
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

  mainButton: {
    height: 58,
    justifyContent:
      'center',
    alignItems: 'center',
    backgroundColor:
      COLORS.primary,
    borderRadius: 17,
    marginTop: 28,
  },

  mainButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
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

  quizContent: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
  },

  counter: {
    color: COLORS.text,
    fontWeight: '700',
  },

  combo: {
    color: COLORS.warning,
    fontWeight: '800',
  },

  sessionXp: {
    color: COLORS.success,
    fontWeight: '800',
  },

  progressTrack: {
    height: 6,
    backgroundColor:
      COLORS.surfaceLight,
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
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
  },

  meta: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
  },

  level: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 11,
  },

  pos: {
    color:
      COLORS.textMuted,
  },

  questionHint: {
    color:
      COLORS.textMuted,
    textAlign: 'center',
    marginTop: 28,
    fontSize: 12,
  },

  meaning: {
    color: COLORS.text,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 38,
    marginVertical: 25,
  },

  optionContainer: {
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
    padding: 12,
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

  correctLetter: {
    backgroundColor:
      COLORS.success,
  },

  wrongLetter: {
    backgroundColor:
      COLORS.danger,
  },

  optionLetterText: {
    color: COLORS.text,
    fontWeight: '800',
  },

  optionText: {
    color: COLORS.text,
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },

  feedback: {
    marginTop: 18,
  },

  feedbackTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
  },

  correctAnswer: {
    color:
      COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 7,
  },

  speakButton: {
    alignSelf: 'center',
    backgroundColor:
      COLORS.surfaceLight,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 12,
    marginTop: 12,
  },

  speakText: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  nextButton: {
    height: 52,
    backgroundColor:
      COLORS.primary,
    borderRadius: 16,
    justifyContent:
      'center',
    alignItems: 'center',
    marginTop: 14,
  },

  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  resultContent: {
    padding: 24,
    paddingTop: 45,
    alignItems: 'center',
  },

  resultEmoji: {
    fontSize: 60,
  },

  resultTitle: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 12,
  },

  accuracy: {
    color: COLORS.primary,
    fontSize: 56,
    fontWeight: '900',
    marginTop: 25,
  },

  accuracyLabel: {
    color:
      COLORS.textMuted,
  },

  resultGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent:
      'space-between',
    marginTop: 28,
  },

  resultCard: {
    width: '48%',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 17,
    alignItems: 'center',
    padding: 18,
  },

  resultValue: {
    fontSize: 25,
    fontWeight: '900',
  },

  resultLabel: {
    color:
      COLORS.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  totalXp: {
    color:
      COLORS.textMuted,
    fontWeight: '700',
    marginTop: 20,
  },

  backButton: {
    padding: 16,
  },

  backText: {
    color:
      COLORS.textSecondary,
    fontWeight: '600',
  },
});