import { generateHeatmapGrid } from '../src/domain/heatmapCalculator';
import { normalizeDate } from '../src/domain/streakEngine';
import { JournalEntry } from '../src/types/domain';

describe('heatmapCalculator', () => {
  const today = normalizeDate(new Date());

  it('generates the exact requested number of days (28 days)', () => {
    const grid = generateHeatmapGrid([], 28);
    expect(grid.length).toBe(28);
    expect(grid[grid.length - 1].date).toBe(today);
  });

  it('correctly maps 100% completion to intensity 4', () => {
    const entries: JournalEntry[] = [
      {
        id: '1',
        date: today,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mood: 5,
        energyLevel: 5,
        title: 'Full Day',
        notes: '',
        habits: [
          { id: 'h1', label: 'Habit 1', icon: 'water-outline', category: 'body', completed: true },
          { id: 'h2', label: 'Habit 2', icon: 'leaf-outline', category: 'mind', completed: true },
        ],
        tags: [],
      },
    ];

    const grid = generateHeatmapGrid(entries, 28);
    const todayCell = grid[grid.length - 1];
    expect(todayCell.intensity).toBe(4);
    expect(todayCell.completedCount).toBe(2);
    expect(todayCell.totalHabits).toBe(2);
  });

  it('maps 50% completion to intensity 2', () => {
    const entries: JournalEntry[] = [
      {
        id: '1',
        date: today,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mood: 3,
        energyLevel: 3,
        title: 'Half Day',
        notes: '',
        habits: [
          { id: 'h1', label: 'Habit 1', icon: 'water-outline', category: 'body', completed: true },
          { id: 'h2', label: 'Habit 2', icon: 'leaf-outline', category: 'mind', completed: false },
        ],
        tags: [],
      },
    ];

    const grid = generateHeatmapGrid(entries, 28);
    const todayCell = grid[grid.length - 1];
    expect(todayCell.intensity).toBe(2);
    expect(todayCell.completedCount).toBe(1);
    expect(todayCell.totalHabits).toBe(2);
  });
});
