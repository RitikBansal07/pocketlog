import { JournalEntrySchema, JsonImportSchema } from '../src/domain/validation';

describe('validation', () => {
  it('validates a correct journal entry payload', () => {
    const validEntry = {
      id: 'LOG-001',
      date: '2026-10-28',
      createdAt: '2026-10-28T10:00:00Z',
      updatedAt: '2026-10-28T10:00:00Z',
      mood: 4,
      energyLevel: 4,
      title: 'Valid Entry Title',
      notes: 'Some valid notes',
      habits: [
        {
          id: 'h1',
          label: 'Hydration',
          icon: 'water-outline',
          category: 'body',
          completed: true,
        },
      ],
      tags: ['health'],
    };

    const parsed = JournalEntrySchema.safeParse(validEntry);
    expect(parsed.success).toBe(true);
  });

  it('rejects entries with invalid date format', () => {
    const invalidDate = {
      id: 'LOG-001',
      date: '28-10-2026', // wrong format
      createdAt: '2026-10-28T10:00:00Z',
      updatedAt: '2026-10-28T10:00:00Z',
      mood: 4,
      energyLevel: 4,
      title: 'Valid',
      notes: '',
      habits: [],
      tags: [],
    };

    const parsed = JournalEntrySchema.safeParse(invalidDate);
    expect(parsed.success).toBe(false);
  });

  it('rejects entries with mood score outside 1-5', () => {
    const invalidMood = {
      id: 'LOG-001',
      date: '2026-10-28',
      createdAt: '2026-10-28T10:00:00Z',
      updatedAt: '2026-10-28T10:00:00Z',
      mood: 6, // Invalid
      energyLevel: 4,
      title: 'Valid',
      notes: '',
      habits: [],
      tags: [],
    };

    const parsed = JournalEntrySchema.safeParse(invalidMood);
    expect(parsed.success).toBe(false);
  });

  it('validates a valid JSON backup schema for import', () => {
    const validBackup = {
      version: 1,
      exportedAt: '2026-10-28T10:00:00Z',
      entries: [
        {
          id: 'LOG-001',
          date: '2026-10-28',
          createdAt: '2026-10-28T10:00:00Z',
          updatedAt: '2026-10-28T10:00:00Z',
          mood: 5,
          energyLevel: 5,
          title: 'Imported',
          notes: 'Notes',
          habits: [],
          tags: [],
        },
      ],
    };

    const parsed = JsonImportSchema.safeParse(validBackup);
    expect(parsed.success).toBe(true);
  });
});
