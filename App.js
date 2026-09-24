import React, {
  useEffect,
} from 'react';

import {
  Platform,
} from 'react-native';

import {
  NavigationContainer,
  DarkTheme,
} from '@react-navigation/native';

import RootNavigator
  from './src/navigation/RootNavigator';

import {
  COLORS,
} from './src/theme/colors';

const navigationTheme = {
  ...DarkTheme,

  colors: {
    ...DarkTheme.colors,

    primary:
      COLORS.primary,

    background:
      COLORS.background,

    card:
      COLORS.surface,

    text:
      COLORS.text,

    border:
      COLORS.border,

    notification:
      COLORS.primary,
  },
};

export default function App() {
  

  return (
    <NavigationContainer
      theme={navigationTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}