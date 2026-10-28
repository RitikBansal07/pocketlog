import { IPocketLogApi } from './client';
import { JournalEntry, VaultSettings, StreakStats } from '../types/domain';
import { JournalEntryInput, JsonImportSchema } from '../domain/validation';
import { storageRepository, DEFAULT_VAULT_SETTINGS } from './storageRepository';
import { calculateStreakStats } from '../domain/streakEngine';
import { createInitialSeedEntries } from './mockSeedData';

export class MockPocketLogApi implements IPocketLogApi {
  private latencyMs: number = 80;

  private async delay(): Promise<void> {
    if (this.latencyMs <= 0) return;
    return new Promise((res) => setTimeout(res, this.latencyMs));
  }

  async getEntries(): Promise<JournalEntry[]> {
    await this.delay();
    const entries = await storageRepository.getEntries();
    // Sort descending by date
    return entries.sort((a, b) => (a.date > b.date ? -1 : 1));
  }

  async getEntryById(id: string): Promise<JournalEntry> {
    await this.delay();
    const entries = await storageRepository.getEntries();
    const entry = entries.find((e) => e.id === id);
    if (!entry) throw new Error(`Entry with ID '${id}' not found.`);
    return entry;
  }

  async createEntry(input: JournalEntryInput): Promise<JournalEntry> {
    await this.delay();
    const entries = await storageRepository.getEntries();
    const nowIso = new Date().toISOString();
    const newEntry: JournalEntry = {
      ...input,
      id: `LOG-${Date.now().toString(36).toUpperCase()}`,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const updated = [newEntry, ...entries];
    await storageRepository.saveEntries(updated);
    return newEntry;
  }

  async updateEntry(id: string, updates: Partial<JournalEntryInput>): Promise<JournalEntry> {
    await this.delay();
    const entries = await storageRepository.getEntries();
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Entry ${id} not found.`);

    const existing = entries[index];
    const updatedEntry: JournalEntry = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    entries[index] = updatedEntry;
    await storageRepository.saveEntries(entries);
    return updatedEntry;
  }

  async deleteEntry(id: string): Promise<void> {
    await this.delay();
    const entries = await storageRepository.getEntries();
    const filtered = entries.filter((e) => e.id !== id);
    await storageRepository.saveEntries(filtered);
  }

  async toggleHabit(entryId: string, habitId: string): Promise<JournalEntry> {
    await this.delay();
    const entries = await storageRepository.getEntries();
    const entryIndex = entries.findIndex((e) => e.id === entryId);
    if (entryIndex === -1) throw new Error(`Entry ${entryId} not found.`);

    const entry = entries[entryIndex];
    const updatedHabits = entry.habits.map((h) =>
      h.id === habitId ? { ...h, completed: !h.completed } : h
    );

    const updatedEntry: JournalEntry = {
      ...entry,
      habits: updatedHabits,
      updatedAt: new Date().toISOString(),
    };

    entries[entryIndex] = updatedEntry;
    await storageRepository.saveEntries(entries);
    return updatedEntry;
  }

  async getVaultSettings(): Promise<VaultSettings> {
    await this.delay();
    return await storageRepository.getVaultSettings();
  }

  async updateVaultSettings(settings: Partial<VaultSettings>): Promise<VaultSettings> {
    await this.delay();
    const current = await storageRepository.getVaultSettings();
    const merged = { ...current, ...settings };
    await storageRepository.saveVaultSettings(merged);
    return merged;
  }

  async getStreakStats(): Promise<StreakStats> {
    await this.delay();
    const entries = await storageRepository.getEntries();
    return calculateStreakStats(entries);
  }

  async exportDataJson(): Promise<string> {
    await this.delay();
    const entries = await storageRepository.getEntries();
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      entries,
    };
    return JSON.stringify(payload, null, 2);
  }

  async importDataJson(jsonString: string): Promise<number> {
    await this.delay();
    try {
      const parsed = JSON.parse(jsonString);
      const validated = JsonImportSchema.parse(parsed);
      const existing = await storageRepository.getEntries();

      // Merge avoiding duplicate IDs
      const existingIds = new Set(existing.map((e) => e.id));
      const newItems = validated.entries.filter((e) => !existingIds.has(e.id));
      const combined = [...newItems, ...existing];

      await storageRepository.saveEntries(combined);
      return newItems.length;
    } catch (err: any) {
      throw new Error(`Invalid JSON backup format: ${err.message}`);
    }
  }

  async resetToSampleData(): Promise<void> {
    await this.delay();
    const seed = createInitialSeedEntries();
    await storageRepository.saveEntries(seed);
    await storageRepository.saveVaultSettings(DEFAULT_VAULT_SETTINGS);
  }

  async nuclearDataWipe(): Promise<void> {
    await this.delay();
    await storageRepository.clearAllData();
  }
}

export const mockApi = new MockPocketLogApi();
