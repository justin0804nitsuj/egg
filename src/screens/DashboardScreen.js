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

import {
  COLORS,
} from '../theme/colors';

import {
  getDashboardData,
} from '../storage/progress';

const DEFAULT_DATA = {
  xp: 0,

  level: 1,
  xpInLevel: 0,
  xpNeeded: 100,

  streak: 0,
  longestStreak: 0,

  totalReviews: 0,
  sessionsCompleted: 0,

  learnedWords: 0,
  masteredWords: 0,

  dueReviews: 0,

  today: {
    reviews: 0,
    xp: 0,
    sessions: 0,
  },
};

export default function DashboardScreen({
  navigation,
}) {
  const [
    data,
    setData,
  ] = useState(DEFAULT_DATA);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadData() {
        const result =
          await getDashboardData();

        if (active) {
          setData(result);
        }
      }

      loadData();

      return () => {
        active = false;
      };
    }, [])
  );

  const levelProgress =
    Math.min(
      100,

      (
        data.xpInLevel /
        data.xpNeeded
      ) * 100
    );

  const missions = [
    {
      title:
        '複習 10 個單字',

      current:
        data.today.reviews,

      target: 10,

      unit: '個',
    },

    {
      title:
        '獲得 50 XP',

      current:
        data.today.xp,

      target: 50,

      unit: ' XP',
    },

    {
      title:
        '完成 1 場作戰',

      current:
        data.today.sessions,

      target: 1,

      unit: '場',
    },
  ];

  function goToTraining() {
    navigation.navigate(
      'Flashcard'
    );
  }

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
      <View style={styles.header}>
        <View>
          <Text
            style={styles.eyebrow}
          >
            COMMAND CENTER
          </Text>

          <Text
            style={styles.title}
          >
            基地
          </Text>
        </View>

        <View
          style={
            styles.streakBadge
          }
        >
          <Text
            style={
              styles.streakEmoji
            }
          >
            🔥
          </Text>

          <Text
            style={
              styles.streakText
            }
          >
            {data.streak}
          </Text>
        </View>
      </View>

      <View
        style={styles.levelCard}
      >
        <View
          style={styles.levelTop}
        >
          <View>
            <Text
              style={
                styles.levelLabel
              }
            >
              PLAYER LEVEL
            </Text>

            <Text
              style={
                styles.levelValue
              }
            >
              {data.level}
            </Text>
          </View>

          <View
            style={styles.xpBlock}
          >
            <Text
              style={styles.totalXp}
            >
              {data.xp}
            </Text>

            <Text
              style={styles.xpLabel}
            >
              TOTAL XP
            </Text>
          </View>
        </View>

        <View
          style={
            styles.progressInfo
          }
        >
          <Text
            style={
              styles.progressLabel
            }
          >
            下一級
          </Text>

          <Text
            style={
              styles.progressValue
            }
          >
            {data.xpInLevel}
            {' / '}
            {data.xpNeeded} XP
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
                  `${levelProgress}%`,
              },
            ]}
          />
        </View>
      </View>

      <Text
        style={
          styles.sectionTitle
        }
      >
        今日戰況
      </Text>

      <View
        style={styles.statsGrid}
      >
        <StatCard
          value={
            data.today.reviews
          }
          label="今日複習"
          icon="⚔️"
        />

        <StatCard
          value={
            data.today.xp
          }
          label="今日 XP"
          icon="⚡"
        />

        <StatCard
          value={
            data.dueReviews
          }
          label="待複習"
          icon="⏰"
        />

        <StatCard
          value={
            data.masteredWords
          }
          label="已精通"
          icon="🏆"
        />
      </View>

      <Text
        style={
          styles.sectionTitle
        }
      >
        每日任務
      </Text>

      <View
        style={
          styles.missionCard
        }
      >
        {missions.map(
          (
            mission,
            index
          ) => {
            const completed =
              mission.current >=
              mission.target;

            const percent =
              Math.min(
                100,

                (
                  mission.current /
                  mission.target
                ) * 100
              );

            return (
              <View
                key={
                  mission.title
                }
              >
                <View
                  style={
                    styles.missionRow
                  }
                >
                  <View
                    style={[
                      styles.missionCheck,

                      completed &&
                        styles.missionCheckDone,
                    ]}
                  >
                    <Text
                      style={
                        styles.missionCheckText
                      }
                    >
                      {completed
                        ? '✓'
                        : ''}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.missionContent
                    }
                  >
                    <View
                      style={
                        styles.missionTitleRow
                      }
                    >
                      <Text
                        style={
                          styles.missionTitle
                        }
                      >
                        {mission.title}
                      </Text>

                      <Text
                        style={
                          styles.missionCount
                        }
                      >
                        {Math.min(
                          mission.current,
                          mission.target
                        )}
                        /
                        {mission.target}
                        {mission.unit}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.missionTrack
                      }
                    >
                      <View
                        style={[
                          styles.missionFill,

                          {
                            width:
                              `${percent}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {index <
                  missions.length -
                    1 && (
                  <View
                    style={
                      styles.missionDivider
                    }
                  />
                )}
              </View>
            );
          }
        )}
      </View>

      <View
        style={
          styles.streakCard
        }
      >
        <View>
          <Text
            style={
              styles.streakCardLabel
            }
          >
            連續學習
          </Text>

          <Text
            style={
              styles.streakCardValue
            }
          >
            🔥 {data.streak} 天
          </Text>
        </View>

        <View
          style={styles.bestStreak}
        >
          <Text
            style={
              styles.bestLabel
            }
          >
            最佳紀錄
          </Text>

          <Text
            style={
              styles.bestValue
            }
          >
            {data.longestStreak}{' '}
            天
          </Text>
        </View>
      </View>

      <Pressable
        onPress={goToTraining}
        style={({ pressed }) => [
          styles.trainingButton,

          pressed &&
            styles.pressed,
        ]}
      >
        <View>
          <Text
            style={
              styles.trainingLabel
            }
          >
            READY FOR BATTLE?
          </Text>

          <Text
            style={
              styles.trainingTitle
            }
          >
            繼續作戰
          </Text>
        </View>

        <Text
          style={
            styles.trainingArrow
          }
        >
          →
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function StatCard({
  value,
  label,
  icon,
}) {
  return (
    <View
      style={styles.statCard}
    >
      <Text
        style={styles.statIcon}
      >
        {icon}
      </Text>

      <Text
        style={styles.statValue}
      >
        {value}
      </Text>

      <Text
        style={styles.statLabel}
      >
        {label}
      </Text>
    </View>
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

    header: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      marginTop: 8,
    },

    eyebrow: {
      color: COLORS.primary,

      fontSize: 11,
      fontWeight: '800',

      letterSpacing: 2,
    },

    title: {
      color: COLORS.text,

      fontSize: 34,
      fontWeight: '800',

      marginTop: 4,
    },

    streakBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      paddingHorizontal: 14,

      paddingVertical: 9,

      borderRadius: 16,
    },

    streakEmoji: {
      fontSize: 18,

      marginRight: 6,
    },

    streakText: {
      color: COLORS.warning,

      fontSize: 17,
      fontWeight: '800',
    },

    levelCard: {
      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 22,

      padding: 20,

      marginTop: 24,
    },

    levelTop: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems:
        'flex-start',
    },

    levelLabel: {
      color:
        COLORS.textMuted,

      fontSize: 10,
      fontWeight: '800',

      letterSpacing: 1.4,
    },

    levelValue: {
      color: COLORS.primary,

      fontSize: 48,
      fontWeight: '900',

      marginTop: 2,
    },

    xpBlock: {
      alignItems: 'flex-end',
    },

    totalXp: {
      color: COLORS.text,

      fontSize: 28,
      fontWeight: '800',
    },

    xpLabel: {
      color:
        COLORS.textMuted,

      fontSize: 10,
      fontWeight: '700',

      marginTop: 3,
    },

    progressInfo: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      marginTop: 20,
    },

    progressLabel: {
      color:
        COLORS.textSecondary,

      fontSize: 12,
    },

    progressValue: {
      color:
        COLORS.textSecondary,

      fontSize: 12,
      fontWeight: '600',
    },

    progressTrack: {
      height: 8,

      backgroundColor:
        COLORS.surfaceLight,

      borderRadius: 4,

      overflow: 'hidden',

      marginTop: 9,
    },

    progressFill: {
      height: '100%',

      backgroundColor:
        COLORS.primary,

      borderRadius: 4,
    },

    sectionTitle: {
      color: COLORS.text,

      fontSize: 18,
      fontWeight: '800',

      marginTop: 28,
      marginBottom: 13,
    },

    statsGrid: {
      flexDirection: 'row',

      flexWrap: 'wrap',

      justifyContent:
        'space-between',

      gap: 10,
    },

    statCard: {
      width: '48%',

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 18,

      padding: 16,
    },

    statIcon: {
      fontSize: 18,
    },

    statValue: {
      color: COLORS.text,

      fontSize: 27,
      fontWeight: '800',

      marginTop: 12,
    },

    statLabel: {
      color:
        COLORS.textSecondary,

      fontSize: 12,

      marginTop: 3,
    },

    missionCard: {
      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 20,

      padding: 17,
    },

    missionRow: {
      flexDirection: 'row',

      alignItems: 'center',

      paddingVertical: 7,
    },

    missionCheck: {
      width: 28,
      height: 28,

      borderRadius: 14,

      borderWidth: 2,

      borderColor:
        COLORS.textMuted,

      justifyContent:
        'center',

      alignItems: 'center',

      marginRight: 13,
    },

    missionCheckDone: {
      backgroundColor:
        COLORS.success,

      borderColor:
        COLORS.success,
    },

    missionCheckText: {
      color: '#FFFFFF',

      fontWeight: '900',
    },

    missionContent: {
      flex: 1,
    },

    missionTitleRow: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    missionTitle: {
      color: COLORS.text,

      fontSize: 14,
      fontWeight: '600',
    },

    missionCount: {
      color:
        COLORS.textMuted,

      fontSize: 11,
    },

    missionTrack: {
      height: 5,

      backgroundColor:
        COLORS.surfaceLight,

      borderRadius: 3,

      overflow: 'hidden',

      marginTop: 8,
    },

    missionFill: {
      height: '100%',

      backgroundColor:
        COLORS.success,

      borderRadius: 3,
    },

    missionDivider: {
      height: 1,

      backgroundColor:
        COLORS.border,

      marginVertical: 8,
    },

    streakCard: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 20,

      padding: 18,

      marginTop: 14,
    },

    streakCardLabel: {
      color:
        COLORS.textMuted,

      fontSize: 11,
      fontWeight: '700',
    },

    streakCardValue: {
      color: COLORS.text,

      fontSize: 22,
      fontWeight: '800',

      marginTop: 4,
    },

    bestStreak: {
      alignItems: 'flex-end',
    },

    bestLabel: {
      color:
        COLORS.textMuted,

      fontSize: 11,
    },

    bestValue: {
      color:
        COLORS.warning,

      fontSize: 16,
      fontWeight: '700',

      marginTop: 4,
    },

    trainingButton: {
      minHeight: 76,

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      backgroundColor:
        COLORS.primary,

      borderRadius: 20,

      paddingHorizontal: 20,

      marginTop: 24,
    },

    trainingLabel: {
      color:
        'rgba(255,255,255,0.7)',

      fontSize: 9,
      fontWeight: '800',

      letterSpacing: 1.4,
    },

    trainingTitle: {
      color: '#FFFFFF',

      fontSize: 20,
      fontWeight: '800',

      marginTop: 4,
    },

    trainingArrow: {
      color: '#FFFFFF',

      fontSize: 30,

      fontWeight: '300',
    },

    pressed: {
      opacity: 0.75,

      transform: [
        {
          scale: 0.99,
        },
      ],
    },
  });