import React, {
  useEffect,
  useRef,
} from 'react';

import {
  Animated,
  StyleSheet,
  Text,
} from 'react-native';

import {
  COLORS,
} from '../theme/colors';

export default function XpBurst({
  amount,
  combo,
  visible,
}) {
  const scale =
    useRef(
      new Animated.Value(0.5)
    ).current;

  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const translateY =
    useRef(
      new Animated.Value(10)
    ).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    scale.setValue(0.5);

    opacity.setValue(0);

    translateY.setValue(10);

    const animation =
      Animated.parallel([
        Animated.spring(
          scale,
          {
            toValue: 1,

            friction: 4,

            tension: 90,

            useNativeDriver:
              true,
          }
        ),

        Animated.sequence([
          Animated.timing(
            opacity,
            {
              toValue: 1,

              duration: 120,

              useNativeDriver:
                true,
            }
          ),

          Animated.delay(450),

          Animated.timing(
            opacity,
            {
              toValue: 0,

              duration: 250,

              useNativeDriver:
                true,
            }
          ),
        ]),

        Animated.timing(
          translateY,
          {
            toValue: -25,

            duration: 800,

            useNativeDriver:
              true,
          }
        ),
      ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    visible,
    amount,
    combo,
    opacity,
    scale,
    translateY,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,

        {
          opacity,

          transform: [
            {
              translateY,
            },

            {
              scale,
            },
          ],
        },
      ]}
    >
      <Text
        style={styles.xp}
      >
        +{amount} XP
      </Text>

      {combo >= 3 && (
        <Text
          style={styles.combo}
        >
          🔥 COMBO x{combo}
        </Text>
      )}

      {combo >= 10 && (
        <Text
          style={styles.fire}
        >
          ON FIRE!
        </Text>
      )}
    </Animated.View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      position: 'absolute',

      top: '34%',

      left: 0,

      right: 0,

      zIndex: 999,

      alignItems: 'center',

      pointerEvents: 'none',
    },

    xp: {
      color:
        COLORS.success,

      fontSize: 30,

      fontWeight: '900',
    },

    combo: {
      color:
        COLORS.warning,

      fontSize: 17,

      fontWeight: '900',

      marginTop: 3,
    },

    fire: {
      color:
        COLORS.warning,

      fontSize: 12,

      fontWeight: '900',

      letterSpacing: 2,

      marginTop: 3,
    },
  });