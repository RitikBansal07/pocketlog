import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JournalEntry } from '../../types/domain';
import { MOOD_DEFINITIONS } from './MoodSelector';
import { WaveformBar } from '../ui/WaveformBar';
import { Haptics } from '../../utils/haptics';

interface SwipeableEntryCardProps {
  entry: JournalEntry;
  onPress: () => void;
  onToggleHabit: (habitId: string) => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
}

export const SwipeableEntryCard: React.FC<SwipeableEntryCardProps> = ({
  entry,
  onPress,
  onToggleHabit,
  onDelete,
  onToggleFavorite,
}) => {
  const moodInfo = MOOD_DEFINITIONS[entry.mood];
  const completedHabits = entry.habits.filter((h) => h.completed).length;

  const handleHabitPress = (habitId: string) => {
    Haptics.impactAsync('light');
    onToggleHabit(habitId);
  };

  const handleFavoritePress = () => {
    Haptics.selectionAsync();
    if (onToggleFavorite) onToggleFavorite();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
      testID={`entry-card-${entry.id}`}
      accessibilityRole="button"
      accessibilityLabel={`Journal entry for ${entry.date}: ${entry.title}`}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.dateMoodRow}>
          <View style={styles.moodEmojiCircle}>
            <Text style={styles.moodEmoji}>{moodInfo.emoji}</Text>
          </View>
          <View>
            <Text style={styles.dateText}>{entry.date}</Text>
            <Text style={[styles.moodLabelText, { color: moodInfo.color }]}>
              {moodInfo.label} • Energy {entry.energyLevel}/5
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          {onToggleFavorite && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={handleFavoritePress}
              accessibilityRole="button"
              accessibilityLabel="Toggle Favorite"
            >
              <Ionicons
                name={entry.isFavorite ? 'heart' : 'heart-outline'}
                size={18}
                color={entry.isFavorite ? '#EF4444' : '#64748B'}
              />
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onDelete}
              accessibilityRole="button"
              accessibilityLabel="Delete Entry"
              testID={`delete-entry-btn-${entry.id}`}
            >
              <Ionicons name="trash-outline" size={17} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Title & Notes Snippet */}
      <View style={styles.bodyWrap}>
        <Text style={styles.titleText}>{entry.title}</Text>
        <Text style={styles.notesText} numberOfLines={2}>
          {entry.notes}
        </Text>
      </View>

      {/* Voice Reflection Audio Bar if present */}
      {entry.audioMemo ? (
        <View style={styles.audioWrap}>
          <WaveformBar
            uri={entry.audioMemo.uri}
            waveformHeights={entry.audioMemo.waveformHeights}
            durationSec={entry.audioMemo.durationSec}
            recordedAt={entry.audioMemo.recordedAt}
          />
        </View>
      ) : null}

      {/* Interactive Habits Row */}
      {entry.habits.length > 0 && (
        <View style={styles.habitsWrap}>
          <View style={styles.habitsHeader}>
            <Text style={styles.habitsTitle}>HABITS</Text>
            <Text style={styles.habitsCounter}>
              {completedHabits} / {entry.habits.length} Done
            </Text>
          </View>

          <View style={styles.habitsRow}>
            {entry.habits.map((habit) => {
              return (
                <TouchableOpacity
                  key={habit.id}
                  style={[
                    styles.habitChip,
                    habit.completed && styles.habitChipCompleted,
                  ]}
                  onPress={() => handleHabitPress(habit.id)}
                  activeOpacity={0.7}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: habit.completed }}
                  accessibilityLabel={`${habit.label}, ${habit.completed ? 'completed' : 'not completed'}`}
                >
                  <Ionicons
                    name={habit.completed ? 'checkmark-circle' : (habit.icon as any)}
                    size={13}
                    color={habit.completed ? '#10B981' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.habitText,
                      habit.completed && styles.habitTextCompleted,
                    ]}
                  >
                    {habit.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Tags Row */}
      {entry.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {entry.tags.map((tag) => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagPillText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateMoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  moodEmojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  moodLabelText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    padding: 6,
  },
  bodyWrap: {
    marginBottom: 10,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  audioWrap: {
    marginVertical: 8,
  },
  habitsWrap: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  habitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  habitsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  habitsCounter: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  habitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  habitChipCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  habitText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  habitTextCompleted: {
    color: '#34D399',
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#818CF8',
  },
});

