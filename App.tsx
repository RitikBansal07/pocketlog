import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, AppState, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { RootStackParamList, MainTabParamList } from './src/types/navigation';
import { JournalTimelineScreen } from './src/screens/JournalTimelineScreen';
import { InsightsScreen } from './src/screens/InsightsScreen';
import { VaultSettingsScreen } from './src/screens/VaultSettingsScreen';
import { EntryDetailScreen } from './src/screens/EntryDetailScreen';
import { EntryEditorScreen } from './src/screens/EntryEditorScreen';
import { BiometricLockModal } from './src/components/domain/BiometricLockModal';
import { useVaultStore } from './src/store/useVaultStore';
import { storageRepository } from './src/api/storageRepository';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#818CF8',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'journal-outline';
          if (route.name === 'TimelineTab') iconName = 'journal';
          else if (route.name === 'InsightsTab') iconName = 'bar-chart';
          else if (route.name === 'VaultTab') iconName = 'shield-checkmark';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="TimelineTab"
        component={JournalTimelineScreen}
        options={{ tabBarLabel: 'Timeline' }}
      />
      <Tab.Screen
        name="InsightsTab"
        component={InsightsScreen}
        options={{ tabBarLabel: 'Insights' }}
      />
      <Tab.Screen
        name="VaultTab"
        component={VaultSettingsScreen}
        options={{ tabBarLabel: 'Vault' }}
      />
    </Tab.Navigator>
  );
}

const isWeb = Platform.OS === 'web';

export default function App() {
  const { isLocked, unlock, lock, setObfuscated, isBackgroundObfuscated } = useVaultStore();

  useEffect(() => {
    // Initial check for vault lock
    const initVault = async () => {
      const settings = await storageRepository.getVaultSettings();
      if (settings.biometricsEnabled) {
        lock();
      }
    };
    initVault();

    // AppState listener for privacy snapshot obfuscation
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        setObfuscated(true);
      } else if (nextAppState === 'active') {
        setObfuscated(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <View style={isWeb ? styles.webWrapper : styles.nativeWrapper}>
          <View style={isWeb ? styles.webAppContainer : styles.nativeAppContainer}>
            <NavigationContainer>
              <StatusBar style="light" />
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                <Stack.Screen name="EntryDetail" component={EntryDetailScreen} />
                <Stack.Screen name="EntryEditor" component={EntryEditorScreen} />
              </Stack.Navigator>
            </NavigationContainer>

            {/* Biometric Security App Lock Modal */}
            <BiometricLockModal visible={isLocked} onUnlocked={unlock} />

            {/* Privacy Obfuscation Mask (active when backgrounded) */}
            {isBackgroundObfuscated && <View style={styles.privacyMaskOverlay} />}
          </View>
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  nativeWrapper: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  nativeAppContainer: {
    flex: 1,
  },
  webWrapper: {
    flex: 1,
    backgroundColor: '#060911',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  webAppContainer: {
    width: '100%',
    maxWidth: 540,
    height: '100%',
    backgroundColor: '#0B0F19',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
  },
  privacyMaskOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0B0F19',
    zIndex: 9999,
  },
});
