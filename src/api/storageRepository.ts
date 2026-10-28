import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, VaultSettings } from '../types/domain';
import { createInitialSeedEntries } from './mockSeedData';

const STORAGE_KEY_ENTRIES = '@pocketlog_v1_entries';
const STORAGE_KEY_VAULT = '@pocketlog_v1_vault';

export const DEFAULT_VAULT_SETTINGS: VaultSettings = {
  biometricsEnabled: true,
  themeMode: 'dark',
  autoLockDelaySeconds: 0,
  obfuscateOnBackground: true,
};

export class StorageRepository {
  async getEntries(): Promise<JournalEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_ENTRIES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Seed default data on fresh install
      const seed = createInitialSeedEntries();
      await this.saveEntries(seed);
      return seed;
    } catch {
      return createInitialSeedEntries();
    }
  }

  async saveEntries(entries: JournalEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  async getVaultSettings(): Promise<VaultSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_VAULT);
      if (data) {
        return { ...DEFAULT_VAULT_SETTINGS, ...JSON.parse(data) };
      }
      return DEFAULT_VAULT_SETTINGS;
    } catch {
      return DEFAULT_VAULT_SETTINGS;
    }
  }

  async saveVaultSettings(settings: VaultSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(settings));
    } catch (e) {
      console.warn('Vault settings save failed:', e);
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_ENTRIES);
      await AsyncStorage.removeItem(STORAGE_KEY_VAULT);
    } catch (e) {
      console.warn('Clear data failed:', e);
    }
  }
}

export const storageRepository = new StorageRepository();

