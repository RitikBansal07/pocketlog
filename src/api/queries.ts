import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from './mockApi';
import { JournalEntry, VaultSettings, StreakStats } from '../types/domain';
import { JournalEntryInput } from '../domain/validation';

export function useEntriesQuery() {
  return useQuery<JournalEntry[]>({
    queryKey: ['entries'],
    queryFn: () => mockApi.getEntries(),
    staleTime: 1000 * 30,
  });
}

export function useEntryDetailQuery(id: string) {
  return useQuery<JournalEntry>({
    queryKey: ['entry', id],
    queryFn: () => mockApi.getEntryById(id),
    staleTime: 1000 * 30,
    enabled: !!id,
  });
}

export function useStreakStatsQuery() {
  return useQuery<StreakStats>({
    queryKey: ['streakStats'],
    queryFn: () => mockApi.getStreakStats(),
    staleTime: 1000 * 30,
  });
}

export function useVaultSettingsQuery() {
  return useQuery<VaultSettings>({
    queryKey: ['vaultSettings'],
    queryFn: () => mockApi.getVaultSettings(),
    staleTime: 1000 * 60,
  });
}

export function useCreateEntryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: JournalEntryInput) => mockApi.createEntry(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['streakStats'] });
    },
  });
}

export function useUpdateEntryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<JournalEntryInput> }) =>
      mockApi.updateEntry(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['entry', data.id] });
      queryClient.invalidateQueries({ queryKey: ['streakStats'] });
    },
  });
}

export function useDeleteEntryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockApi.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['streakStats'] });
    },
  });
}

export function useToggleHabitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entryId, habitId }: { entryId: string; habitId: string }) =>
      mockApi.toggleHabit(entryId, habitId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['entry', data.id] });
      queryClient.invalidateQueries({ queryKey: ['streakStats'] });
    },
  });
}

export function useUpdateVaultSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<VaultSettings>) => mockApi.updateVaultSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaultSettings'] });
    },
  });
}
