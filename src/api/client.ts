import { JournalEntry, VaultSettings, StreakStats } from '../types/domain';
import { JournalEntryInput } from '../domain/validation';

export interface IPocketLogApi {
  getEntries(): Promise<JournalEntry[]>;
  getEntryById(id: string): Promise<JournalEntry>;
  createEntry(input: JournalEntryInput): Promise<JournalEntry>;
  updateEntry(id: string, updates: Partial<JournalEntryInput>): Promise<JournalEntry>;
  deleteEntry(id: string): Promise<void>;
  toggleHabit(entryId: string, habitId: string): Promise<JournalEntry>;
  getVaultSettings(): Promise<VaultSettings>;
  updateVaultSettings(settings: Partial<VaultSettings>): Promise<VaultSettings>;
  getStreakStats(): Promise<StreakStats>;
  exportDataJson(): Promise<string>;
  importDataJson(jsonString: string): Promise<number>;
  resetToSampleData(): Promise<void>;
  nuclearDataWipe(): Promise<void>;
}

