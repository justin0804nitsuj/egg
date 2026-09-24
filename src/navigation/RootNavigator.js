import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import MainTabs
  from './MainTabs';

import WordDetailScreen
  from '../screens/WordDetailScreen';

import FlashcardScreen
  from '../screens/FlashcardScreen';

import MultipleChoiceScreen
  from '../screens/MultipleChoiceScreen';

import ChineseToEnglishScreen
  from '../screens/ChineseToEnglishScreen';

import SpellingScreen
  from '../screens/SpellingScreen';

import {
  COLORS,
} from '../theme/colors';

const Stack =
  createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor:
            COLORS.background,
        },

        headerTintColor:
          COLORS.text,

        headerShadowVisible:
          false,

        contentStyle: {
          backgroundColor:
            COLORS.background,
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WordDetail"
        component={
          WordDetailScreen
        }
        options={({ route }) => ({
          title:
            route.params
              ?.word?.word ??
            '單字詳情',
        })}
      />

      <Stack.Screen
        name="FlashcardSession"
        component={
          FlashcardScreen
        }
        options={{
          title: 'Flashcard',
        }}
      />

      <Stack.Screen
        name="MultipleChoice"
        component={
          MultipleChoiceScreen
        }
        options={{
          title: '英 → 中',
        }}
      />

      <Stack.Screen
        name="ChineseToEnglish"
        component={
          ChineseToEnglishScreen
        }
        options={{
          title: '中 → 英',
        }}
      />

      <Stack.Screen
        name="Spelling"
        component={
          SpellingScreen
        }
        options={{
          title: '拼字挑戰',
        }}
      />
    </Stack.Navigator>
  );
}