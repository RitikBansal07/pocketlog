import { filterEntries, extractUniqueTags } from '../src/domain/filterEngine';
import { normalizeDate } from '../src/domain/streakEngine';
import { JournalEntry, EntryFilterParams } from '../src/types/domain';

describe('filterEngine', () => {
  const today = normalizeDate(new Date());

  const sampleEntries: JournalEntry[] = [
    {
      id: '1',
      date: today,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mood: 5,
      energyLevel: 5,
      title: 'Morning Yoga and Meditation',
      notes: 'Felt very energized and calm after session.',
      habits: [{ id: 'h1', label: 'Yoga', icon: 'leaf-outline', category: 'body', completed: true }],
      tags: ['mindfulness', 'fitness'],
    },
    {
      id: '2',
      date: today,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mood: 2,
      energyLevel: 2,
      title: 'Tough workday',
      notes: 'Spent too much time debugging database errors.',
      habits: [{ id: 'h2', label: 'Walk', icon: 'walk-outline', category: 'body', completed: false }],
      tags: ['work', 'stress'],
    },
    {
      id: '3',
      date: '2025-01-01', // Out of range for 7D
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mood: 4,
      energyLevel: 4,
      title: 'Old New Year log',
      notes: 'New year resolutions',
      habits: [],
      tags: ['holiday'],
    },
  ];

  it('filters by keyword in title or notes', () => {
    const params: EntryFilterParams = {
      dateRange: 'ALL',
      selectedMoods: [],
      selectedHabits: [],
      selectedTags: [],
      searchQuery: 'Yoga',
    };
    const res = filterEntries(sampleEntries, params);
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('1');
  });

  it('filters by mood score', () => {
    const params: EntryFilterParams = {
      dateRange: 'ALL',
      selectedMoods: [5],
      selectedHabits: [],
      selectedTags: [],
    };
    const res = filterEntries(sampleEntries, params);
    expect(res.length).toBe(1);
    expect(res[0].mood).toBe(5);
  });

  it('filters by date range (7D)', () => {
    const params: EntryFilterParams = {
      dateRange: '7D',
      selectedMoods: [],
      selectedHabits: [],
      selectedTags: [],
    };
    const res = filterEntries(sampleEntries, params);
    expect(res.length).toBe(2); // Only today's entries
  });

  it('extracts unique sorted tags', () => {
    const tags = extractUniqueTags(sampleEntries);
    expect(tags).toEqual(['fitness', 'holiday', 'mindfulness', 'stress', 'work']);
  });
});
