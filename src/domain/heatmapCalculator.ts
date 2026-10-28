import { JournalEntry, HeatmapDay } from '../types/domain';
import { normalizeDate } from './streakEngine';

/**
 * Generates an array of HeatmapDay objects for the past N days (default: 28 days / 4 full weeks).
 * Intensity levels:
 * 0 = 0% completion (or no entry)
 * 1 = 1% - 25%
 * 2 = 26% - 50%
 * 3 = 51% - 75%
 * 4 = 76% - 100%
 */
export function generateHeatmapGrid(entries: JournalEntry[], daysCount: number = 28): HeatmapDay[] {
  const result: HeatmapDay[] = [];
  const activeEntries = entries.filter((e) => !e.isArchived);

  // Map entries by date for O(1) lookup
  const entryMap = new Map<string, JournalEntry>();
  activeEntries.forEach((entry) => {
    entryMap.set(entry.date, entry);
  });

  const now = new Date();

  // Generate days in chronological order from (daysCount - 1) days ago to today
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    const dateStr = normalizeDate(d);
    const dayOfWeek = d.getDay();
    const dayOfMonth = d.getDate();

    const entry = entryMap.get(dateStr);

    if (!entry || entry.habits.length === 0) {
      result.push({
        date: dateStr,
        dayOfWeek,
        dayOfMonth,
        intensity: 0,
        completedCount: 0,
        totalHabits: 0,
      });
      continue;
    }

    const completed = entry.habits.filter((h) => h.completed).length;
    const total = entry.habits.length;
    const ratio = completed / total;

    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    if (ratio === 0) intensity = 0;
    else if (ratio <= 0.25) intensity = 1;
    else if (ratio <= 0.5) intensity = 2;
    else if (ratio <= 0.75) intensity = 3;
    else intensity = 4;

    result.push({
      date: dateStr,
      dayOfWeek,
      dayOfMonth,
      intensity,
      completedCount: completed,
      totalHabits: total,
    });
  }

  return result;
}

