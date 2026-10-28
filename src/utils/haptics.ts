import { Platform } from 'react-native';

/**
 * Cross-platform haptic feedback helper.
 * Uses window.navigator.vibrate on web when available,
 * and handles native platforms safely.
 */
export const Haptics = {
  selectionAsync: async (): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        navigator.vibrate(10);
      }
      return;
    }
  },

  impactAsync: async (style: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        const ms = style === 'light' ? 15 : style === 'medium' ? 25 : 45;
        navigator.vibrate(ms);
      }
      return;
    }
  },

  notificationAsync: async (type: 'success' | 'warning' | 'error' = 'success'): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        if (type === 'error') navigator.vibrate([30, 40, 30]);
        else if (type === 'warning') navigator.vibrate([20, 30, 20]);
        else navigator.vibrate([15, 20]);
      }
      return;
    }
  },
};

