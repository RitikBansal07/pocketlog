import { calculateStreakStats, normalizeDate } from '../src/domain/streakEngine';
import { JournalEntry } from '../src/types/domain';

describe('streakEngine', () => {
  const today = normalizeDate(new Date());
  const yesterday = normalizeDate(new Date(Date.now() - 86400000));
  const twoDaysAgo = normalizeDate(new Date(Date.now() - 86400000 * 2));
  const fourDaysAgo = normalizeDate(new Date(Date.now() - 86400000 * 4));

  it('returns 0 streak when entries array is empty', () => {
    const stats = calculateStreakStats([]);
    expect(stats.currentStreakDays).toBe(0);
    expect(stats.longestStreakDays).toBe(0);
    expect(stats.totalEntriesLogged).toBe(0);
  });

  it('calculates active 3-day streak correctly', () => {
    const entries: JournalEntry[] = [
      {
        id: '1',
        date: today,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mood: 5,
        energyLevel: 5,
        title: 'Today',
        notes: '',
        habits: [{ id: 'h1', label: 'Hydration', icon: 'water-outline', category: 'body', completed: true }],
        tags: [],
      },
      {
        id: '2',
        date: yesterday,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mood: 4,
        energyLevel: 4,
        title: 'Yesterday',
        notes: '',
        habits: [{ id: 'h1', label: 'Hydration', icon: 'water-outline', category: 'body', completed: true }],
        tags: [],
      },
      {
        id: '3',
        date: twoDaysAgo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mood: 4,
        energyLevel: 4,
        title: 'Two days ago',
        notes: '',
        habits: [{ id: 'h1', label: 'Hydration', icon: 'water-outline', category: 'body', completed: true }],
        tags: [],
      },
    ];

    const stats = calculateStreakStats(entries);
    expect(stats.currentStreakDays).toBe(3);
    expect(stats.longestStreakDays).toBe(3);
    expect(stats.totalEntriesLogged).toBe(3);
  });

  it('breaks streak when a day is missed', () => {
    const entries: JournalEntry[] = [
      {
        id: '1',
        date: today,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mood: 5,
        energyLevel: 5,
        title: 'Today',
        notes: '',
        habits: [],
        tags: [],
      },
      {
        id: '2',
        date: fourDaysAgo, // Gap of 3 days
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mood: 4,
        energyLevel: 4,
        title: 'Four days ago',
        notes: '',
        habits: [],
        tags: [],
      },
    ];

    const stats = calculateStreakStats(entries);
    expect(stats.currentStreakDays).toBe(1);
    expect(stats.totalEntriesLogged).toBe(2);
  });
});
