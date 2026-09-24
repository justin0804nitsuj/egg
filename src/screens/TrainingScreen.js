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

import { COLORS }
  from '../theme/colors';

import {
  getDashboardData,
} from '../storage/progress';

export default function TrainingScreen({
  navigation,
}) {
  const [stats, setStats] =
    useState({
      xp: 0,
      dueReviews: 0,
    });

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        const result =
          await getDashboardData();

        if (active) {
          setStats({
            xp: result.xp,

            dueReviews:
              result.dueReviews,
          });
        }
      }

      load();

      return () => {
        active = false;
      };
    }, [])
  );

  function openScreen(name) {
    const parent =
      navigation.getParent();

    if (parent) {
      parent.navigate(name);
    }
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
      <Text style={styles.eyebrow}>
        TRAINING AREA
      </Text>

      <Text style={styles.title}>
        作戰區
      </Text>

      <Text style={styles.subtitle}>
        選擇訓練方式。
        所有模式都共用你的熟練度、
        XP 與 SRS 複習進度。
      </Text>

      <View
        style={styles.statusCard}
      >
        <StatusItem
          label="待複習"
          value={
            stats.dueReviews
          }
        />

        <View
          style={
            styles.statusDivider
          }
        />

        <StatusItem
          label="TOTAL XP"
          value={stats.xp}
        />
      </View>

      <Text
        style={
          styles.sectionTitle
        }
      >
        作戰模式
      </Text>

      <ModeCard
        icon="🃏"
        badge="CLASSIC"
        title="Flashcard"
        description="翻開答案後，自己判斷熟悉程度。"
        onPress={() =>
          openScreen(
            'FlashcardSession'
          )
        }
      />

      <ModeCard
        icon="🎯"
        badge="QUIZ"
        title="英 → 中"
        description="看到英文，從四個中文答案中選出正解。"
        onPress={() =>
          openScreen(
            'MultipleChoice'
          )
        }
      />

      <ModeCard
        icon="🔄"
        badge="QUIZ"
        title="中 → 英"
        description="看到中文，從四個英文單字中找出正解。"
        onPress={() =>
          openScreen(
            'ChineseToEnglish'
          )
        }
      />

      <ModeCard
        icon="⌨️"
        badge="HARD"
        title="拼字挑戰"
        description="沒有選項。直接把正確英文完整拼出來。"
        onPress={() =>
          openScreen(
            'Spelling'
          )
        }
        highlighted
      />

      <View style={styles.tip}>
        <Text style={styles.tipIcon}>
          🧠
        </Text>

        <View style={{ flex: 1 }}>
          <Text
            style={styles.tipTitle}
          >
            共用 SRS 引擎
          </Text>

          <Text
            style={
              styles.tipText
            }
          >
            四種模式的答題結果都會更新同一個單字熟練度與下次複習時間。
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function StatusItem({
  label,
  value,
}) {
  return (
    <View>
      <Text
        style={
          styles.statusLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.statusValue
        }
      >
        {value}
      </Text>
    </View>
  );
}

function ModeCard({
  icon,
  badge,
  title,
  description,
  onPress,
  highlighted = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.modeCard,

        highlighted &&
          styles.highlighted,

        pressed &&
          styles.pressed,
      ]}
    >
      <View
        style={styles.iconBox}
      >
        <Text
          style={styles.icon}
        >
          {icon}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={
            styles.modeTitleRow
          }
        >
          <Text
            style={
              styles.modeTitle
            }
          >
            {title}
          </Text>

          <View
            style={styles.badge}
          >
            <Text
              style={
                styles.badgeText
              }
            >
              {badge}
            </Text>
          </View>
        </View>

        <Text
          style={
            styles.description
          }
        >
          {description}
        </Text>
      </View>

      <Text style={styles.arrow}>
        →
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

  content: {
    padding: 20,
    paddingBottom: 50,
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
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color:
      COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  statusCard: {
    flexDirection: 'row',
    justifyContent:
      'space-around',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 20,
    paddingVertical: 18,
    marginTop: 24,
  },

  statusDivider: {
    width: 1,
    backgroundColor:
      COLORS.border,
  },

  statusLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },

  statusValue: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 4,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 28,
    marginBottom: 12,
  },

  modeCard: {
    minHeight: 105,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },

  highlighted: {
    borderColor:
      COLORS.warning,
  },

  iconBox: {
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor:
      COLORS.surfaceLight,
    marginRight: 14,
  },

  icon: {
    fontSize: 25,
  },

  modeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  modeTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },

  badge: {
    backgroundColor:
      `${COLORS.primary}20`,
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 8,
  },

  badgeText: {
    color: COLORS.primary,
    fontSize: 8,
    fontWeight: '800',
  },

  description: {
    color:
      COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  arrow: {
    color: COLORS.primary,
    fontSize: 25,
    marginLeft: 8,
  },

  tip: {
    flexDirection: 'row',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
  },

  tipIcon: {
    fontSize: 22,
    marginRight: 12,
  },

  tipTitle: {
    color: COLORS.text,
    fontWeight: '700',
  },

  tipText: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
});