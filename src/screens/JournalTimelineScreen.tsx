import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';
import {
  useEntriesQuery,
  useStreakStatsQuery,
  useToggleHabitMutation,
  useDeleteEntryMutation,
  useUpdateEntryMutation,
} from '../api/queries';
import { EntryFilterParams, JournalEntry } from '../types/domain';
import { filterEntries, extractUniqueTags } from '../domain/filterEngine';
import { SwipeableEntryCard } from '../components/domain/SwipeableEntryCard';
import { FilterBar } from '../components/domain/FilterBar';
import { ScreenState } from '../components/ui/ScreenState';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { QuickCheckinSheet } from '../components/domain/QuickCheckinSheet';
import { useVaultStore } from '../store/useVaultStore';
import { normalizeDate } from '../domain/streakEngine';
import { Haptics } from '../utils/haptics';

const INITIAL_FILTER: EntryFilterParams = {
  dateRange: 'ALL',
  selectedMoods: [],
  selectedHabits: [],
  selectedTags: [],
  searchQuery: '',
};

export const JournalTimelineScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const lockVault = useVaultStore((s) => s.lock);

  const { data: entries = [], isLoading, isRefetching, error, refetch } = useEntriesQuery();
  const { data: stats } = useStreakStatsQuery();

  const toggleHabitMutation = useToggleHabitMutation();
  const deleteMutation = useDeleteEntryMutation();
  const updateMutation = useUpdateEntryMutation();

  const [filterParams, setFilterParams] = useState<EntryFilterParams>(INITIAL_FILTER);
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);
  const [quickCheckinVisible, setQuickCheckinVisible] = useState(false);

  // Available tags in active entries
  const availableTags = useMemo(() => extractUniqueTags(entries), [entries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return filterEntries(entries, filterParams);
  }, [entries, filterParams]);

  // Find today's entry
  const todayStr = normalizeDate(new Date());
  const todayEntry = entries.find((e) => e.date === todayStr && !e.isArchived);

  const handleToggleHabit = (entryId: string, habitId: string) => {
    toggleHabitMutation.mutate({ entryId, habitId });
  };

  const handleToggleFavorite = (entry: JournalEntry) => {
    updateMutation.mutate({
      id: entry.id,
      updates: { isFavorite: !entry.isFavorite },
    });
  };

  const handleConfirmDelete = () => {
    if (entryToDelete) {
      deleteMutation.mutate(entryToDelete.id);
      setEntryToDelete(null);
    }
  };

  const handleOpenAddEntry = () => {
    Haptics.selectionAsync();
    navigation.navigate('EntryEditor', {});
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandCol}>
          <View style={styles.logoRow}>
            <Ionicons name="journal" size={20} color="#6366F1" />
            <Text style={styles.brandTitle}>PocketLog</Text>
          </View>
          <Text style={styles.brandSub}>Offline Personal Wellness Journal</Text>
        </View>

        <View style={styles.topActionsRow}>
          <TouchableOpacity
            style={styles.quickCheckinBtn}
            onPress={() => setQuickCheckinVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Quick Habit Check-In"
            testID="quick-checkin-btn"
          >
            <Ionicons name="flash" size={14} color="#FBBF24" />
            <Text style={styles.quickCheckinText}>Check-In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.lockBtn}
            onPress={() => {
              Haptics.selectionAsync();
              lockVault();
            }}
            accessibilityRole="button"
            accessibilityLabel="Lock Vault"
          >
            <Ionicons name="lock-closed" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Streak Highlight Bar */}
      {stats && (
        <View style={styles.streakBar}>
          <View style={styles.streakStat}>
            <Ionicons name="flame" size={18} color="#F97316" />
            <Text style={styles.streakNumber}>{stats.currentStreakDays}d</Text>
            <Text style={styles.streakLabel}>Streak</Text>
          </View>

          <View style={styles.streakDivider} />

          <View style={styles.streakStat}>
            <Ionicons name="checkmark-done" size={18} color="#10B981" />
            <Text style={styles.streakNumber}>{stats.weeklyCompletionRatePercent}%</Text>
            <Text style={styles.streakLabel}>7d Habits</Text>
          </View>

          <View style={styles.streakDivider} />

          <View style={styles.streakStat}>
            <Ionicons name="trophy" size={18} color="#FBBF24" />
            <Text style={styles.streakNumber}>{stats.longestStreakDays}d</Text>
            <Text style={styles.streakLabel}>Best Run</Text>
          </View>
        </View>
      )}

      {/* Filter & Search Bar */}
      <FilterBar
        filterParams={filterParams}
        availableTags={availableTags}
        onChange={setFilterParams}
        onReset={() => setFilterParams(INITIAL_FILTER)}
      />

      {/* Timeline List */}
      <ScreenState
        loading={isLoading}
        error={error ? (error as Error).message : null}
        empty={filteredEntries.length === 0}
        emptyTitle="No Reflections Found"
        emptyMessage="Try adjusting your search criteria, or write a new journal entry."
        emptyActionLabel="Write Reflection"
        onEmptyAction={handleOpenAddEntry}
        onRetry={refetch}
      >
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeableEntryCard
              entry={item}
              onPress={() => navigation.navigate('EntryDetail', { entryId: item.id })}
              onToggleHabit={(habitId) => handleToggleHabit(item.id, habitId)}
              onDelete={() => setEntryToDelete(item)}
              onToggleFavorite={() => handleToggleFavorite(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
              }}
              tintColor="#6366F1"
              colors={['#6366F1']}
            />
          }
        />
      </ScreenState>

      {/* Floating Add Entry Button */}
      <TouchableOpacity
        style={styles.fabBtn}
        onPress={handleOpenAddEntry}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Create New Journal Reflection"
        testID="add-entry-fab"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Quick Check-In Bottom Sheet */}
      <QuickCheckinSheet
        visible={quickCheckinVisible}
        todayEntry={todayEntry}
        onClose={() => setQuickCheckinVisible(false)}
        onToggleHabit={(habitId) => {
          if (todayEntry) handleToggleHabit(todayEntry.id, habitId);
        }}
        onOpenFullEditor={() => navigation.navigate('EntryEditor', { entryId: todayEntry?.id })}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        visible={!!entryToDelete}
        title="Delete Reflection?"
        message={`Are you sure you want to delete the entry for ${entryToDelete?.date}? This local action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setEntryToDelete(null)}
        testID="delete-confirm-modal"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19', // Deep OLED dark
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  brandCol: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickCheckinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  quickCheckinText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FBBF24',
  },
  lockBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  streakBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  streakStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  streakLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  streakDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#1E293B',
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 90,
  },
  fabBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
});
