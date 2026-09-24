import React from 'react';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import DashboardScreen
  from '../screens/DashboardScreen';

import TrainingScreen
  from '../screens/TrainingScreen';

import LibraryScreen
  from '../screens/LibraryScreen';

import {
  COLORS,
} from '../theme/colors';

const Tab =
  createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor:
            COLORS.background,
        },

        headerTintColor:
          COLORS.text,

        headerShadowVisible:
          false,

        tabBarStyle: {
          backgroundColor:
            COLORS.surface,

          borderTopColor:
            COLORS.border,

          height: 70,

          paddingTop: 8,

          paddingBottom: 8,
        },

        tabBarActiveTintColor:
          COLORS.primary,

        tabBarInactiveTintColor:
          COLORS.textMuted,

        sceneStyle: {
          backgroundColor:
            COLORS.background,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={
          DashboardScreen
        }
        options={{
          title: '基地',

          tabBarLabel: '基地',
        }}
      />

      <Tab.Screen
        name="Flashcard"
        component={
          TrainingScreen
        }
        options={{
          title: '作戰區',

          tabBarLabel: '作戰區',
        }}
      />

      <Tab.Screen
        name="Library"
        component={
          LibraryScreen
        }
        options={{
          title: '軍械庫',

          tabBarLabel: '軍械庫',
        }}
      />
    </Tab.Navigator>
  );
}