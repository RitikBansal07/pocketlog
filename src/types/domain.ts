export type MoodScore = 1 | 2 | 3 | 4 | 5; // 1: Terrible, 2: Down, 3: Neutral, 4: Good, 5: Radiant

export type HabitCategory = 'mind' | 'body' | 'growth' | 'rest';

export interface HabitItem {
  id: string;
  label: string; // e.g. "Hydration 2.5L", "Morning Meditation", "Read 20 mins", "8h Sleep"
  icon: string;
  category: HabitCategory;
  completed: boolean;
}

export interface AudioMemo {
  id: string;
  uri: string;
  durationSec: number;
  recordedAt: string;
  waveformHeights: number[]; // 16 sample amplitude heights for waveform visualization
}

export interface JournalEntry {
  id: string; // e.g. "LOG-20261028-01"
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO timestamp
  updatedAt: string;
  mood: MoodScore;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  title: string;
  notes: string; // Reflection notes / gratitude bullets
  habits: HabitItem[];
  tags: string[]; // e.g. ["fitness", "mindfulness", "deep-work", "family"]
  audioMemo?: AudioMemo;
  isFavorite?: boolean;
  isArchived?: boolean;
}

export interface StreakStats {
  currentStreakDays: number;
  longestStreakDays: number;
  totalEntriesLogged: number;
  weeklyCompletionRatePercent: number;
  mostFrequentHabit: string;
  completedHabitsCount: number;
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6 (0 = Sun, 6 = Sat)
  dayOfMonth: number;
  intensity: 0 | 1 | 2 | 3 | 4; // 0: 0%, 1: 1-25%, 2: 26-50%, 3: 51-75%, 4: 76-100%
  completedCount: number;
  totalHabits: number;
}

export interface EntryFilterParams {
  searchQuery?: string;
  dateRange: '7D' | '30D' | '90D' | 'ALL';
  selectedMoods: MoodScore[];
  selectedHabits: string[];
  selectedTags: string[];
}

export type ThemeMode = 'dark' | 'light' | 'system';

export interface VaultSettings {
  biometricsEnabled: boolean;
  pinCode?: string; // 4-digit PIN fallback
  themeMode: ThemeMode;
  autoLockDelaySeconds: number; // 0 = immediate, 60 = 1 min
  obfuscateOnBackground: boolean;
  lastUnlockedAt?: string;
}

