import * as Haptics from 'expo-haptics';

export async function successFeedback() {
  try {
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  } catch {}
}

export async function wrongFeedback() {
  try {
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    );
  } catch {}
}

export async function tapFeedback() {
  try {
    await Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );
  } catch {}
}

export async function comboFeedback(combo) {
  try {
    if (combo >= 10) {
      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Heavy
      );
      return;
    }

    if (combo >= 5) {
      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Medium
      );
      return;
    }

    await Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );
  } catch {}
}

export function getComboBonus(combo) {
  if (combo === 10) {
    return 15;
  }

  if (combo === 5) {
    return 8;
  }

  if (combo === 3) {
    return 3;
  }

  return 0;
}