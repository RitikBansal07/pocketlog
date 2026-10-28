import { JournalEntry, HabitItem } from '../types/domain';
import { normalizeDate } from '../domain/streakEngine';

export const STANDARD_HABITS: Omit<HabitItem, 'completed'>[] = [
  { id: 'h1', label: 'Hydration 2.5L', icon: 'water-outline', category: 'body' },
  { id: 'h2', label: 'Morning Mindfulness', icon: 'leaf-outline', category: 'mind' },
  { id: 'h3', label: 'Read 20 Mins', icon: 'book-outline', category: 'growth' },
  { id: 'h4', label: '7.5h Restful Sleep', icon: 'moon-outline', category: 'rest' },
  { id: 'h5', label: 'Daily Walk / Workout', icon: 'fitness-outline', category: 'body' },
];

function generateRelativeDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return normalizeDate(d);
}

export function createInitialSeedEntries(): JournalEntry[] {
  return [
    {
      id: 'LOG-001',
      date: generateRelativeDate(0), // Today
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mood: 5,
      energyLevel: 5,
      title: 'Clarity, Great Energy & Deep Flow',
      notes:
        'Woke up early before the alarm. Completed a 20-minute guided breathwork session and drank 750ml electrolyte water right away. Spent 3 hours on focused React Native architecture work with zero interruptions. Truly grateful for quiet mornings.',
      habits: [
        { id: 'h1', label: 'Hydration 2.5L', icon: 'water-outline', category: 'body', completed: true },
        { id: 'h2', label: 'Morning Mindfulness', icon: 'leaf-outline', category: 'mind', completed: true },
        { id: 'h3', label: 'Read 20 Mins', icon: 'book-outline', category: 'growth', completed: true },
        { id: 'h4', label: '7.5h Restful Sleep', icon: 'moon-outline', category: 'rest', completed: true },
        { id: 'h5', label: 'Daily Walk / Workout', icon: 'fitness-outline', category: 'body', completed: true },
      ],
      tags: ['deep-work', 'mindfulness', 'energy'],
      isFavorite: true,
      audioMemo: {
        id: 'aud-001',
        uri: 'file://mock-audio-today.m4a',
        durationSec: 42,
        recordedAt: '08:45 AM',
        waveformHeights: [14, 28, 42, 60, 85, 95, 70, 48, 65, 88, 100, 75, 45, 30, 20, 15],
      },
    },
    {
      id: 'LOG-002',
      date: generateRelativeDate(1), // Yesterday
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      mood: 4,
      energyLevel: 4,
      title: 'Evening Run & Good Book Chapter',
      notes:
        'Went for a 5km evening jog around the local park. Sunset was golden. Cooked dinner with fresh veggies. Read two chapters of "Atomic Habits" before bedtime.',
      habits: [
        { id: 'h1', label: 'Hydration 2.5L', icon: 'water-outline', category: 'body', completed: true },
        { id: 'h2', label: 'Morning Mindfulness', icon: 'leaf-outline', category: 'mind', completed: true },
        { id: 'h3', label: 'Read 20 Mins', icon: 'book-outline', category: 'growth', completed: true },
        { id: 'h4', label: '7.5h Restful Sleep', icon: 'moon-outline', category: 'rest', completed: false },
        { id: 'h5', label: 'Daily Walk / Workout', icon: 'fitness-outline', category: 'body', completed: true },
      ],
      tags: ['fitness', 'reading', 'gratitude'],
    },
    {
      id: 'LOG-003',
      date: generateRelativeDate(2),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      mood: 4,
      energyLevel: 3,
      title: 'Steady Rhythm & Tea Meditation',
      notes:
        'A balanced Tuesday. Handled backlog code reviews smoothly. Afternoon slump hit slightly around 3 PM, so swapped coffee for herbal mint tea and took a 15-minute screen break.',
      habits: [
        { id: 'h1', label: 'Hydration 2.5L', icon: 'water-outline', category: 'body', completed: true },
        { id: 'h2', label: 'Morning Mindfulness', icon: 'leaf-outline', category: 'mind', completed: true },
        { id: 'h3', label: 'Read 20 Mins', icon: 'book-outline', category: 'growth', completed: true },
        { id: 'h4', label: '7.5h Restful Sleep', icon: 'moon-outline', category: 'rest', completed: true },
        { id: 'h5', label: 'Daily Walk / Workout', icon: 'fitness-outline', category: 'body', completed: false },
      ],
      tags: ['mindfulness', 'balance'],
    },
    {
      id: 'LOG-004',
      date: generateRelativeDate(3),
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      mood: 3,
      energyLevel: 3,
      title: 'Rainy Afternoon Reset',
      notes:
        'Weather was overcast and chilly. Slower pace today, but stayed organized. Reminded myself that consistency does not require perfection—doing 60% of habits is still a win.',
      habits: [
        { id: 'h1', label: 'Hydration 2.5L', icon: 'water-outline', category: 'body', completed: true },
        { id: 'h2', label: 'Morning Mindfulness', icon: 'leaf-outline', category: 'mind', completed: false },
        { id: 'h3', label: 'Read 20 Mins', icon: 'book-outline', category: 'growth', completed: true },
        { id: 'h4', label: '7.5h Restful Sleep', icon: 'moon-outline', category: 'rest', completed: true },
        { id: 'h5', label: 'Daily Walk / Workout', icon: 'fitness-outline', category: 'body', completed: false },
      ],
      tags: ['reflection', 'rest'],
    },
    {
      id: 'LOG-005',
      date: generateRelativeDate(4),
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      mood: 5,
      energyLevel: 5,
      title: 'Weekend Hike & Nature Reboot',
      notes:
        'Explored the hill trails early morning. Fresh pine air and zero screen time until lunchtime. Came home feeling completely recharged and mentally sharp.',
      habits: [
        { id: 'h1', label: 'Hydration 2.5L', icon: 'water-outline', category: 'body', completed: true },
        { id: 'h2', label: 'Morning Mindfulness', icon: 'leaf-outline', category: 'mind', completed: true },
        { id: 'h3', label: 'Read 20 Mins', icon: 'book-outline', category: 'growth', completed: true },
        { id: 'h4', label: '7.5h Restful Sleep', icon: 'moon-outline', category: 'rest', completed: true },
        { id: 'h5', label: 'Daily Walk / Workout', icon: 'fitness-outline', category: 'body', completed: true },
      ],
      tags: ['nature', 'fitness', 'gratitude'],
      isFavorite: true,
      audioMemo: {
        id: 'aud-005',
        uri: 'file://mock-audio-hike.m4a',
        durationSec: 56,
        recordedAt: '11:15 AM',
        waveformHeights: [20, 35, 60, 75, 90, 80, 65, 85, 95, 100, 70, 50, 40, 25, 15, 10],
      },
    },
    {
      id: 'LOG-006',
      date: generateRelativeDate(5),
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      mood: 4,
      energyLevel: 4,
      title: 'Family Dinner & Unplugged Evening',
      notes:
        'Spent quality time cooking together. Put phone in airplane mode from 7 PM onwards. Sleep tracker registered 8 hours 12 minutes of deep restful sleep.',
      habits: [
        { id: 'h1', label: 'Hydration 2.5L', icon: 'water-outline', category: 'body', completed: true },
        { id: 'h2', label: 'Morning Mindfulness', icon: 'leaf-outline', category: 'mind', completed: true },
        { id: 'h3', label: 'Read 20 Mins', icon: 'book-outline', category: 'growth', completed: false },
        { id: 'h4', label: '7.5h Restful Sleep', icon: 'moon-outline', category: 'rest', completed: true },
        { id: 'h5', label: 'Daily Walk / Workout', icon: 'fitness-outline', category: 'body', completed: true },
      ],
      tags: ['family', 'rest', 'digital-detox'],
    },
    {
      id: 'LOG-007',
      date: generateRelativeDate(6),
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      mood: 5,
      energyLevel: 4,
      title: 'Milestone Shipped & Celebrated',
      notes:
        'Shipped the feature release on schedule. Team celebrated over coffee. Finished the week feeling proud of the steady discipline and deliberate craft.',
      habits: [
        { id: 'h1', label: 'Hydration 2.5L', icon: 'water-outline', category: 'body', completed: true },
        { id: 'h2', label: 'Morning Mindfulness', icon: 'leaf-outline', category: 'mind', completed: true },
        { id: 'h3', label: 'Read 20 Mins', icon: 'book-outline', category: 'growth', completed: true },
        { id: 'h4', label: '7.5h Restful Sleep', icon: 'moon-outline', category: 'rest', completed: true },
        { id: 'h5', label: 'Daily Walk / Workout', icon: 'fitness-outline', category: 'body', completed: true },
      ],
      tags: ['deep-work', 'celebration'],
    },
    {
      id: 'LOG-008',
      date: generateRelativeDate(7),
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      mood: 4,
      energyLevel: 4,
      title: 'Morning Cold Shower & Focus',
      notes: 'Testing cold water immersion routine. Definitely wakes up the nervous system. Maintained high concentration throughout the day.',
      habits: [
        { id: 'h1', label: 'Hydration 2.5L', icon: 'water-outline', category: 'body', completed: true },
        { id: 'h2', label: 'Morning Mindfulness', icon: 'leaf-outline', category: 'mind', completed: true },
        { id: 'h3', label: 'Read 20 Mins', icon: 'book-outline', category: 'growth', completed: true },
        { id: 'h4', label: '7.5h Restful Sleep', icon: 'moon-outline', category: 'rest', completed: true },
        { id: 'h5', label: 'Daily Walk / Workout', icon: 'fitness-outline', category: 'body', completed: false },
      ],
      tags: ['fitness', 'mindfulness'],
    },
  ];
}

