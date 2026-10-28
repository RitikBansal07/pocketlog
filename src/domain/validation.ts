import { z } from 'zod';

export const HabitCategorySchema = z.enum(['mind', 'body', 'growth', 'rest']);

export const HabitItemSchema = z.object({
  id: z.string().min(1, 'Habit ID is required'),
  label: z.string().min(1, 'Habit label cannot be empty').max(60, 'Habit label too long'),
  icon: z.string().default('checkmark-circle-outline'),
  category: HabitCategorySchema,
  completed: z.boolean().default(false),
});

export const AudioMemoSchema = z.object({
  id: z.string().min(1),
  uri: z.string().min(1),
  durationSec: z.number().nonnegative(),
  recordedAt: z.string(),
  waveformHeights: z.array(z.number()).default([]),
});

export const JournalEntrySchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  createdAt: z.string(),
  updatedAt: z.string(),
  mood: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  energyLevel: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title exceeds 100 characters'),
  notes: z.string().max(2500, 'Notes cannot exceed 2500 characters'),
  habits: z.array(HabitItemSchema),
  tags: z.array(z.string().min(1)).max(10, 'Cannot exceed 10 tags'),
  audioMemo: AudioMemoSchema.optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export const JournalEntryInputSchema = JournalEntrySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const JsonImportSchema = z.object({
  version: z.number().default(1),
  exportedAt: z.string().optional(),
  entries: z.array(JournalEntrySchema),
});

export type JournalEntryInput = z.infer<typeof JournalEntryInputSchema>;
