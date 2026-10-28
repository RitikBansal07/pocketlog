import { JournalEntry, StreakStats } from '../types/domain';

/**
 * Normalizes date string into YYYY-MM-DD local format
 */
export function normalizeDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculates day difference between two YYYY-MM-DD dates (d1 - d2 in days)
 */
export function diffDays(d1: string, d2: string): number {
  const t1 = new Date(d1).getTime();
  const t2 = new Date(d2).getTime();
  return Math.round((t1 - t2) / (1000 * 60 * 60 * 24));
}

/**
 * Computes active consecutive streaks, historical longest streak,
 * and completion statistics across user journal entries.
 */
export function calculateStreakStats(entries: JournalEntry[]): StreakStats {
  const activeEntries = entries.filter((e) => !e.isArchived);

  if (activeEntries.length === 0) {
    return {
      currentStreakDays: 0,
      longestStreakDays: 0,
      totalEntriesLogged: 0,
      weeklyCompletionRatePercent: 0,
      mostFrequentHabit: 'None yet',
      completedHabitsCount: 0,
    };
  }

  // Get unique sorted dates in descending order (most recent first)
  const uniqueDates = Array.from(new Set(activeEntries.map((e) => e.date))).sort(
    (a, b) => (a > b ? -1 : 1)
  );

  const todayStr = normalizeDate(new Date());
  const yesterdayStr = normalizeDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

  // Determine current streak
  let currentStreak = 0;
  const mostRecentDate = uniqueDates[0];

  // A streak is active if the latest entry is today or yesterday
  if (mostRecentDate === todayStr || mostRecentDate === yesterdayStr) {
    currentStreak = 1;
    let expectedNextDate = new Date(mostRecentDate);

    for (let i = 1; i < uniqueDates.length; i++) {
      expectedNextDate.setDate(expectedNextDate.getDate() - 1);
      const expectedStr = normalizeDate(expectedNextDate);

      if (uniqueDates[i] === expectedStr) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Determine longest historical streak
  let longestStreak = 0;
  if (uniqueDates.length > 0) {
    // Sort ascending for forward scan
    const ascDates = [...uniqueDates].sort();
    let tempStreak = 1;
    longestStreak = 1;

    for (let i = 1; i < ascDates.length; i++) {
      const prev = new Date(ascDates[i - 1]);
      prev.setDate(prev.getDate() + 1);
      const expected = normalizeDate(prev);

      if (ascDates[i] === expected) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }
  }

  // Calculate habit stats
  const habitCounts: Record<string, number> = {};
  let totalHabitsCount = 0;
  let completedHabitsCount = 0;

  // Last 7 days completion rate
  let weeklyTotal = 0;
  let weeklyCompleted = 0;

  activeEntries.forEach((entry) => {
    const isPastWeek = diffDays(todayStr, entry.date) <= 7 && diffDays(todayStr, entry.date) >= 0;

    entry.habits.forEach((habit) => {
      totalHabitsCount++;
      if (isPastWeek) weeklyTotal++;

      if (habit.completed) {
        completedHabitsCount++;
        if (isPastWeek) weeklyCompleted++;
        habitCounts[habit.label] = (habitCounts[habit.label] || 0) + 1;
      }
    });
  });

  let mostFrequentHabit = 'Hydration';
  let highestCount = 0;
  Object.entries(habitCounts).forEach(([label, count]) => {
    if (count > highestCount) {
      highestCount = count;
      mostFrequentHabit = label;
    }
  });

  const weeklyCompletionRatePercent =
    weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

  return {
    currentStreakDays: currentStreak,
    longestStreakDays: longestStreak,
    totalEntriesLogged: activeEntries.length,
    weeklyCompletionRatePercent,
    mostFrequentHabit,
    completedHabitsCount,
  };
}
