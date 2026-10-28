import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { EntryDetailRouteProp, NavigationProp } from '../types/navigation';
import {
  useEntryDetailQuery,
  useToggleHabitMutation,
  useDeleteEntryMutation,
  useUpdateEntryMutation,
} from '../api/queries';
import { MOOD_DEFINITIONS } from '../components/domain/MoodSelector';
import { WaveformBar } from '../components/ui/WaveformBar';
import { ScreenState } from '../components/ui/ScreenState';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Haptics } from '../utils/haptics';

export const EntryDetailScreen: React.FC = () => {
  const route = useRoute<EntryDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { entryId } = route.params;

  const { data: entry, isLoading, error, refetch } = useEntryDetailQuery(entryId);
  const toggleHabitMutation = useToggleHabitMutation();
  const deleteMutation = useDeleteEntryMutation();
  const updateMutation = useUpdateEntryMutation();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleToggleHabit = (habitId: string) => {
    Haptics.impactAsync('light');
    toggleHabitMutation.mutate({ entryId, habitId });
  };

  const handleToggleFavorite = () => {
    if (!entry) return;
    Haptics.selectionAsync();
    updateMutation.mutate({
      id: entry.id,
      updates: { isFavorite: !entry.isFavorite },
    });
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(entryId, {
      onSuccess: () => {
        setDeleteModalVisible(false);
        Haptics.notificationAsync('success');
        navigation.goBack();
      },
      onError: (err) => Alert.alert('Error', err.message),
    });
  };

  const moodInfo = entry ? MOOD_DEFINITIONS[entry.mood] : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleToggleFavorite}
            accessibilityRole="button"
            accessibilityLabel="Toggle Favorite"
          >
            <Ionicons
              name={entry?.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={entry?.isFavorite ? '#EF4444' : '#94A3B8'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('EntryEditor', { entryId })}
            accessibilityRole="button"
            accessibilityLabel="Edit Entry"
            testID="edit-entry-btn"
          >
            <Ionicons name="create-outline" size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setDeleteModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Delete Entry"
            testID="delete-detail-btn"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScreenState
        loading={isLoading}
        error={error ? (error as Error).message : null}
        onRetry={refetch}
      >
        {entry && moodInfo ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Meta Pill Row */}
            <View style={styles.metaRow}>
              <View style={styles.dateBadge}>
                <Ionicons name="calendar-outline" size={13} color="#6366F1" />
                <Text style={styles.dateText}>{entry.date}</Text>
              </View>

              <View style={[styles.moodBadge, { borderColor: moodInfo.color }]}>
                <Text style={styles.moodEmoji}>{moodInfo.emoji}</Text>
                <Text style={[styles.moodLabel, { color: moodInfo.color }]}>{moodInfo.label}</Text>
              </View>

              <View style={styles.energyBadge}>
                <Ionicons name="flash-outline" size={13} color="#F59E0B" />
                <Text style={styles.energyText}>Energy {entry.energyLevel}/5</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.titleText}>{entry.title}</Text>

            {/* Voice Reflection Audio Bar */}
            {entry.audioMemo ? (
              <View style={styles.audioSection}>
                <Text style={styles.sectionHeader}>AUDIO VOICE REFLECTION</Text>
                <WaveformBar
                  waveformHeights={entry.audioMemo.waveformHeights}
                  durationSec={entry.audioMemo.durationSec}
                  recordedAt={entry.audioMemo.recordedAt}
                />
              </View>
            ) : null}

            {/* Daily Habits Card */}
            {entry.habits.length > 0 && (
              <View style={styles.habitsCard}>
                <View style={styles.habitsHeader}>
                  <Text style={styles.sectionHeader}>DAILY HABITS CHECKLIST</Text>
                  <Text style={styles.habitsCompletedCount}>
                    {entry.habits.filter((h) => h.completed).length} / {entry.habits.length} Done
                  </Text>
                </View>

                <View style={styles.habitsList}>
                  {entry.habits.map((habit) => (
                    <TouchableOpacity
                      key={habit.id}
                      style={[styles.habitRow, habit.completed && styles.habitRowCompleted]}
                      onPress={() => handleToggleHabit(habit.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.habitLeft}>
                        <Ionicons
                          name={habit.completed ? 'checkmark-circle' : (habit.icon as any)}
                          size={18}
                          color={habit.completed ? '#10B981' : '#64748B'}
                        />
                        <Text style={[styles.habitLabel, habit.completed && styles.habitLabelCompleted]}>
                          {habit.label}
                        </Text>
                      </View>
                      <View style={[styles.checkCircle, habit.completed && styles.checkCircleCompleted]}>
                        {habit.completed && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Full Notes Body */}
            <View style={styles.notesCard}>
              <Text style={styles.sectionHeader}>REFLECTION & GRATITUDE</Text>
              <Text style={styles.notesBody}>{entry.notes}</Text>
            </View>

            {/* Tags */}
            {entry.tags.length > 0 && (
              <View style={styles.tagsSection}>
                <Text style={styles.sectionHeader}>TAGS</Text>
                <View style={styles.tagsRow}>
                  {entry.tags.map((t) => (
                    <View key={t} style={styles.tagPill}>
                      <Text style={styles.tagPillText}>#{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        ) : null}
      </ScreenState>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={deleteModalVisible}
        title="Delete Reflection?"
        message="This reflection log will be permanently deleted from your local vault."
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        testID="detail-delete-confirm-modal"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  iconBtn: {
    padding: 6,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
  },
  moodEmoji: {
    fontSize: 14,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  energyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  energyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    lineHeight: 28,
    marginBottom: 16,
  },
  audioSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  habitsCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  habitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitsCompletedCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  habitsList: {
    gap: 6,
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  habitRowCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  habitLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  habitLabelCompleted: {
    color: '#34D399',
    fontWeight: '700',
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  notesCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  notesBody: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 24,
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#818CF8',
  },
});
