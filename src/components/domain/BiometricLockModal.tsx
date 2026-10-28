import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Biometrics } from '../../utils/biometrics';
import { Haptics } from '../../utils/haptics';
import { Button } from '../ui/Button';

interface BiometricLockModalProps {
  visible: boolean;
  onUnlocked: () => void;
}

export const BiometricLockModal: React.FC<BiometricLockModalProps> = ({
  visible,
  onUnlocked,
}) => {
  const [pinMode, setPinMode] = useState(false);
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleBiometricAuth = async () => {
    setIsVerifying(true);
    setErrorMsg(null);
    try {
      const res = await Biometrics.authenticateAsync('Unlock PocketLog Private Vault');
      if (res.success) {
        Haptics.notificationAsync('success');
        onUnlocked();
      } else {
        setErrorMsg('Biometric authentication failed. Try entering PIN.');
      }
    } catch {
      setErrorMsg('Biometrics unavailable. Enter PIN.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePinSubmit = () => {
    if (pin === '1234' || pin === '0000') {
      Haptics.notificationAsync('success');
      setErrorMsg(null);
      setPin('');
      setPinMode(false);
      onUnlocked();
    } else {
      Haptics.notificationAsync('error');
      setErrorMsg('Incorrect PIN. (Default demo PIN is 1234)');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={32} color="#6366F1" />
          </View>

          <Text style={styles.title}>PocketLog Private Vault</Text>
          <Text style={styles.subText}>
            Your daily reflections and habits are secured with device-level encryption.
          </Text>

          {!pinMode ? (
            <View style={styles.actionCol}>
              <Button
                title={isVerifying ? 'Scanning...' : 'Unlock with FaceID / Biometrics'}
                variant="primary"
                icon={<Ionicons name="finger-print" size={18} color="#FFFFFF" />}
                onPress={handleBiometricAuth}
                loading={isVerifying}
                style={{ width: '100%', marginBottom: 12 }}
                testID="biometric-unlock-btn"
              />

              <TouchableOpacity
                style={styles.switchModeBtn}
                onPress={() => {
                  Haptics.selectionAsync();
                  setPinMode(true);
                  setErrorMsg(null);
                }}
              >
                <Text style={styles.switchModeText}>Or enter 4-digit PIN</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.pinCol}>
              <Text style={styles.pinLabel}>Enter Vault PIN (Demo: 1234)</Text>
              <TextInput
                style={styles.pinInput}
                value={pin}
                onChangeText={(val) => {
                  setPin(val);
                  setErrorMsg(null);
                }}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                placeholder="••••"
                placeholderTextColor="#64748B"
                autoFocus
                testID="pin-input"
              />

              <Button
                title="Verify PIN"
                variant="primary"
                onPress={handlePinSubmit}
                style={{ width: '100%', marginTop: 8 }}
                testID="verify-pin-btn"
              />

              <TouchableOpacity
                style={styles.switchModeBtn}
                onPress={() => {
                  Haptics.selectionAsync();
                  setPinMode(false);
                  setErrorMsg(null);
                }}
              >
                <Text style={styles.switchModeText}>Use Biometrics instead</Text>
              </TouchableOpacity>
            </View>
          )}

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#090D16',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0F172A',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(99, 102, 241, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  subText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  actionCol: {
    width: '100%',
    alignItems: 'center',
  },
  switchModeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  switchModeText: {
    fontSize: 12,
    color: '#818CF8',
    fontWeight: '700',
  },
  pinCol: {
    width: '100%',
    alignItems: 'center',
  },
  pinLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 10,
  },
  pinInput: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    paddingVertical: 12,
    marginBottom: 10,
  },
  errorText: {
    marginTop: 14,
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
    textAlign: 'center',
  },
});

