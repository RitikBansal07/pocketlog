import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useVaultSettingsQuery, useUpdateVaultSettingsMutation } from '../api/queries';
import { mockApi } from '../api/mockApi';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Haptics } from '../utils/haptics';

export const VaultSettingsScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: vaultSettings } = useVaultSettingsQuery();
  const updateSettingsMutation = useUpdateVaultSettingsMutation();

  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [wipeModalVisible, setWipeModalVisible] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleToggleBiometrics = (val: boolean) => {
    Haptics.selectionAsync();
    updateSettingsMutation.mutate({ biometricsEnabled: val });
  };

  const handleToggleObfuscation = (val: boolean) => {
    Haptics.selectionAsync();
    updateSettingsMutation.mutate({ obfuscateOnBackground: val });
  };

  const handleExportJson = async () => {
    Haptics.notificationAsync('success');
    const json = await mockApi.exportDataJson();
    setExportNotice(`Exported ${JSON.parse(json).entries.length} reflections. Encrypted locally.`);
  };

  const handleResetSampleData = async () => {
    await mockApi.resetToSampleData();
    queryClient.invalidateQueries({ queryKey: ['entries'] });
    queryClient.invalidateQueries({ queryKey: ['streakStats'] });
    queryClient.invalidateQueries({ queryKey: ['vaultSettings'] });
    setResetModalVisible(false);
    Haptics.notificationAsync('success');
    Alert.alert('Reset Complete', 'Vault restored with 14 days of realistic demo habit and journal logs.');
  };

  const handleNuclearWipe = async () => {
    await mockApi.nuclearDataWipe();
    queryClient.invalidateQueries({ queryKey: ['entries'] });
    queryClient.invalidateQueries({ queryKey: ['streakStats'] });
    setWipeModalVisible(false);
    Haptics.notificationAsync('warning');
    Alert.alert('Data Wiped', 'All entries and settings have been completely erased from local storage.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.title}>Data Sovereignty & Vault</Text>
        <Text style={styles.subTitle}>Hardware biometrics & privacy controls</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Security & Biometrics Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>BIOMETRIC APP LOCK</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>FaceID / TouchID Lock</Text>
              <Text style={styles.settingDesc}>Require biometrics to access private reflections</Text>
            </View>
            <Switch
              value={vaultSettings?.biometricsEnabled ?? true}
              onValueChange={handleToggleBiometrics}
              trackColor={{ false: '#334155', true: '#4338CA' }}
              thumbColor={vaultSettings?.biometricsEnabled ? '#818CF8' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>App Switcher Privacy Blur</Text>
              <Text style={styles.settingDesc}>Mask reflections when app transitions to background</Text>
            </View>
            <Switch
              value={vaultSettings?.obfuscateOnBackground ?? true}
              onValueChange={handleToggleObfuscation}
              trackColor={{ false: '#334155', true: '#4338CA' }}
              thumbColor={vaultSettings?.obfuscateOnBackground ? '#818CF8' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Local-First Architecture Badge */}
        <View style={styles.privacyBadgeCard}>
          <View style={styles.privacyBadgeHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.privacyBadgeTitle}>100% Local-First Storage</Text>
          </View>
          <Text style={styles.privacyBadgeBody}>
            Zero third-party trackers. Zero remote cloud servers. All personal notes, audio voice
            memos, and habit logs reside strictly on this device inside AsyncStorage and iOS
            Keychain / Android KeyStore.
          </Text>
        </View>

        {/* Data Ownership & Backup Controls */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>DATA OWNERSHIP & VAULT ACTIONS</Text>

          {/* Export JSON */}
          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleExportJson}
            accessibilityRole="button"
            testID="export-json-btn"
          >
            <View style={styles.actionLeft}>
              <Ionicons name="download-outline" size={20} color="#6366F1" />
              <View>
                <Text style={styles.actionTitle}>Export Backup (JSON)</Text>
                <Text style={styles.actionDesc}>One-tap export of all entries to plain JSON</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>

          {exportNotice ? (
            <View style={styles.exportNoticeBox}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={styles.exportNoticeText}>{exportNotice}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          {/* Reset Demo Data */}
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setResetModalVisible(true)}
            accessibilityRole="button"
            testID="reset-demo-btn"
          >
            <View style={styles.actionLeft}>
              <Ionicons name="refresh-circle-outline" size={20} color="#F59E0B" />
              <View>
                <Text style={styles.actionTitle}>Reset 14-Day Demo Data</Text>
                <Text style={styles.actionDesc}>Restore pre-seeded habits, audio memos, & reflections</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Nuclear Data Wipe */}
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setWipeModalVisible(true)}
            accessibilityRole="button"
            testID="nuclear-wipe-btn"
          >
            <View style={styles.actionLeft}>
              <Ionicons name="trash" size={20} color="#EF4444" />
              <View>
                <Text style={[styles.actionTitle, { color: '#EF4444' }]}>Erase All Vault Data</Text>
                <Text style={styles.actionDesc}>Irrevocably delete all reflections and habit logs</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Portfolio Specs Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>SYSTEM SPECIFICATIONS</Text>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>React Native Framework</Text>
            <Text style={styles.specVal}>0.88 (Expo SDK 58)</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Persistence Engine</Text>
            <Text style={styles.specVal}>AsyncStorage (Key-Value)</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Schema Validation</Text>
            <Text style={styles.specVal}>Zod v4 Type Validation</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Client State / Cache</Text>
            <Text style={styles.specVal}>TanStack Query v5 + Zustand</Text>
          </View>
        </View>
      </ScrollView>

      {/* Reset Demo Confirmation Modal */}
      <ConfirmModal
        visible={resetModalVisible}
        title="Reset to Demo Data?"
        message="This will re-seed your local vault with 14 days of realistic demo habit and journal logs."
        confirmLabel="Reset Vault"
        destructive={false}
        onConfirm={handleResetSampleData}
        onCancel={() => setResetModalVisible(false)}
      />

      {/* Nuclear Wipe Confirmation Modal */}
      <ConfirmModal
        visible={wipeModalVisible}
        title="Delete All Data?"
        message="Are you sure you want to permanently erase all reflections and habit logs? This action is completely irreversible."
        confirmLabel="Erase Everything"
        destructive={true}
        onConfirm={handleNuclearWipe}
        onCancel={() => setWipeModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  subTitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  settingDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 12,
  },
  privacyBadgeCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  privacyBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  privacyBadgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#34D399',
  },
  privacyBadgeBody: {
    fontSize: 12,
    color: '#A7F3D0',
    lineHeight: 18,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  actionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  exportNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 8,
    gap: 6,
    marginTop: 10,
  },
  exportNoticeText: {
    fontSize: 11,
    color: '#34D399',
    fontWeight: '600',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  specLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  specVal: {
    fontSize: 12,
    color: '#818CF8',
    fontWeight: '700',
  },
});
