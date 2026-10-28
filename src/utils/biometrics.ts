import { Platform } from 'react-native';

export interface BiometricCheckResult {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: ('FINGERPRINT' | 'FACIAL_RECOGNITION')[];
}

/**
 * Cross-platform biometrics helper.
 * Simulates FaceID / TouchID biometric hardware check and authentication.
 */
export const Biometrics = {
  checkAvailability: async (): Promise<BiometricCheckResult> => {
    // Both native and web support simulation
    return {
      hasHardware: true,
      isEnrolled: true,
      supportedTypes: Platform.OS === 'ios' ? ['FACIAL_RECOGNITION'] : ['FINGERPRINT'],
    };
  },

  authenticateAsync: async (promptMessage: string = 'Unlock PocketLog Vault'): Promise<{ success: boolean; error?: string }> => {
    // Simulates successful biometric scan with a realistic 400ms scanner delay
    await new Promise((res) => setTimeout(res, 400));
    return { success: true };
  },
};
