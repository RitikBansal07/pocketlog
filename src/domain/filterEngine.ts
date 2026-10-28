import { JournalEntry, EntryFilterParams, MoodScore } from '../types/domain';
import { diffDays, normalizeDate } from './streakEngine';

/**
 * Filters journal entries across multiple criteria:
 * - Keyword search in title, notes, and habit labels
 * - Date range window (7D, 30D, 90D, or ALL)
 * - Selected mood ratings
 * - Selected habit labels
 * - Selected tags
 */
export function filterEntries(
  entries: JournalEntry[],
  params: EntryFilterParams
): JournalEntry[] {
  const todayStr = normalizeDate(new Date());

  return entries.filter((entry) => {
    // 1. Exclude archived
    if (entry.isArchived) return false;

    // 2. Date Range Filter
    if (params.dateRange !== 'ALL') {
      const daysAgo = diffDays(todayStr, entry.date);
      if (params.dateRange === '7D' && daysAgo > 7) return false;
      if (params.dateRange === '30D' && daysAgo > 30) return false;
      if (params.dateRange === '90D' && daysAgo > 90) return false;
    }

    // 3. Mood Filter
    if (params.selectedMoods && params.selectedMoods.length > 0) {
      if (!params.selectedMoods.includes(entry.mood)) return false;
    }

    // 4. Habit Filter
    if (params.selectedHabits && params.selectedHabits.length > 0) {
      const entryHabitLabels = entry.habits.map((h) => h.label);
      const matchesHabit = params.selectedHabits.some((h) => entryHabitLabels.includes(h));
      if (!matchesHabit) return false;
    }

    // 5. Tag Filter
    if (params.selectedTags && params.selectedTags.length > 0) {
      const matchesTag = params.selectedTags.some((t) => entry.tags.includes(t));
      if (!matchesTag) return false;
    }

    // 6. Keyword Search
    if (params.searchQuery && params.searchQuery.trim().length > 0) {
      const query = params.searchQuery.trim().toLowerCase();
      const inTitle = entry.title.toLowerCase().includes(query);
      const inNotes = entry.notes.toLowerCase().includes(query);
      const inTags = entry.tags.some((t) => t.toLowerCase().includes(query));
      const inHabits = entry.habits.some((h) => h.label.toLowerCase().includes(query));

      if (!inTitle && !inNotes && !inTags && !inHabits) return false;
    }

    return true;
  });
}

/**
 * Extracts a deduplicated, sorted list of all tags present in active entries.
 */
export function extractUniqueTags(entries: JournalEntry[]): string[] {
  const set = new Set<string>();
  entries.forEach((e) => {
    if (!e.isArchived) {
      e.tags.forEach((t) => set.add(t));
    }
  });
  return Array.from(set).sort();
}

