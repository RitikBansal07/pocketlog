import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { EntryEditorRouteProp, NavigationProp } from '../types/navigation';
import { useEntriesQuery, useCreateEntryMutation, useUpdateEntryMutation } from '../api/queries';
import { MoodScore, HabitItem, AudioMemo } from '../types/domain';
import { STANDARD_HABITS } from '../api/mockSeedData';
import { MoodSelector } from '../components/domain/MoodSelector';
import { AudioMemoRecorder } from '../components/domain/AudioMemoRecorder';
import { WaveformBar } from '../components/ui/WaveformBar';
import { Button } from '../components/ui/Button';
import { normalizeDate } from '../domain/streakEngine';
import { Haptics } from '../utils/haptics';

export const EntryEditorScreen: React.FC = () => {
  const route = useRoute<EntryEditorRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const entryId = route.params?.entryId;

  const { data: entries = [] } = useEntriesQuery();
  const createMutation = useCreateEntryMutation();
  const updateMutation = useUpdateEntryMutation();

  const existingEntry = entryId ? entries.find((e) => e.id === entryId) : undefined;

  // Form states
  const [date, setDate] = useState(normalizeDate(new Date()));
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState<MoodScore>(4);
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [habits, setHabits] = useState<HabitItem[]>(
    STANDARD_HABITS.map((h) => ({ ...h, completed: false }))
  );
  const [tags, setTags] = useState<string[]>(['mindfulness']);
  const [tagInput, setTagInput] = useState('');
  const [audioMemo, setAudioMemo] = useState<AudioMemo | undefined>(undefined);
  const [recorderVisible, setRecorderVisible] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; notes?: string }>({});

  useEffect(() => {
    if (existingEntry) {
      setDate(existingEntry.date);
      setTitle(existingEntry.title);
      setNotes(existingEntry.notes);
      setMood(existingEntry.mood);
      setEnergyLevel(existingEntry.energyLevel);
      setHabits(existingEntry.habits);
      setTags(existingEntry.tags);
      setAudioMemo(existingEntry.audioMemo);
    }
  }, [existingEntry]);

  const toggleHabit = (id: string) => {
    Haptics.impactAsync('light');
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    const cleaned = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleSave = () => {
    const errs: { title?: string; notes?: string } = {};
    if (!title.trim() || title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      Haptics.notificationAsync('error');
      return;
    }

    const payload = {
      date,
      title: title.trim(),
      notes: notes.trim(),
      mood,
      energyLevel,
      habits,
      tags,
      audioMemo,
    };

    if (existingEntry) {
      updateMutation.mutate(
        { id: existingEntry.id, updates: payload },
        {
          onSuccess: () => {
            Haptics.notificationAsync('success');
            navigation.goBack();
          },
          onError: (err) => Alert.alert('Error', err.message),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          Haptics.notificationAsync('success');
          navigation.goBack();
        },
        onError: (err) => Alert.alert('Error', err.message),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
        >
          <Ionicons name="close" size={22} color="#94A3B8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{existingEntry ? 'Edit Reflection' : 'New Reflection'}</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          style={styles.saveBtn}
          testID="save-entry-btn"
        >
          <Text style={styles.saveBtnText}>{isSaving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Date & Title */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>ENTRY TITLE</Text>
          <TextInput
            style={[styles.titleInput, !!errors.title && { borderColor: '#EF4444' }]}
            placeholder="e.g. Clarity, Morning Run & Good Book"
            placeholderTextColor="#64748B"
            value={title}
            onChangeText={(val) => {
              setTitle(val);
              setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            testID="entry-title-input"
          />
          {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
        </View>

        {/* Mood Selector */}
        <MoodSelector value={mood} onChange={setMood} />

        {/* Energy Level Selector (1-5) */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>ENERGY LEVEL ({energyLevel}/5)</Text>
          <View style={styles.energyRow}>
            {([1, 2, 3, 4, 5] as const).map((lvl) => {
              const isSelected = energyLevel === lvl;
              return (
                <TouchableOpacity
                  key={lvl}
                  style={[styles.energyChip, isSelected && styles.energyChipActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setEnergyLevel(lvl);
                  }}
                >
                  <Ionicons
                    name="battery-charging"
                    size={16}
                    color={isSelected ? '#6366F1' : '#64748B'}
                  />
                  <Text style={[styles.energyText, isSelected && styles.energyTextActive]}>
                    Level {lvl}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Daily Habits Checklist */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>DAILY HABITS</Text>
          <View style={styles.habitsList}>
            {habits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                style={[styles.habitRow, habit.completed && styles.habitRowCompleted]}
                onPress={() => toggleHabit(habit.id)}
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

        {/* Voice Reflection Audio Memo */}
        <View style={styles.fieldSection}>
          <View style={styles.fieldHeaderRow}>
            <Text style={styles.fieldLabel}>VOICE REFLECTION</Text>
            {audioMemo && (
              <TouchableOpacity onPress={() => setAudioMemo(undefined)}>
                <Text style={styles.removeAudioText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          {audioMemo ? (
            <WaveformBar
              waveformHeights={audioMemo.waveformHeights}
              durationSec={audioMemo.durationSec}
              recordedAt={audioMemo.recordedAt}
            />
          ) : (
            <TouchableOpacity
              style={styles.recordAudioBtn}
              onPress={() => setRecorderVisible(true)}
              testID="open-recorder-btn"
            >
              <Ionicons name="mic-outline" size={18} color="#6366F1" />
              <Text style={styles.recordAudioText}>Record Audio Voice Memo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Reflection Notes Textarea */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>DAILY REFLECTION & GRATITUDE</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={6}
            placeholder="What went well today? What are you grateful for? What challenged you?"
            placeholderTextColor="#64748B"
            value={notes}
            onChangeText={setNotes}
            testID="entry-notes-input"
          />
        </View>

        {/* Tags */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>TAGS</Text>
          <View style={styles.tagInputRow}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add tag (e.g. mindfulness, workout)"
              placeholderTextColor="#64748B"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={styles.addTagBtn} onPress={addTag}>
              <Text style={styles.addTagText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {tags.map((t) => (
              <TouchableOpacity key={t} style={styles.tagChip} onPress={() => removeTag(t)}>
                <Text style={styles.tagChipText}>#{t}</Text>
                <Ionicons name="close-circle" size={12} color="#818CF8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Voice Memo Recorder Modal */}
      <AudioMemoRecorder
        visible={recorderVisible}
        onClose={() => setRecorderVisible(false)}
        onSave={(memo) => setAudioMemo(memo)}
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  closeBtn: {
    padding: 6,
  },
  saveBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  fieldSection: {
    marginBottom: 18,
  },
  fieldHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  titleInput: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
  },
  energyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  energyChip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 4,
  },
  energyChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: '#6366F1',
  },
  energyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  energyTextActive: {
    color: '#818CF8',
    fontWeight: '800',
  },
  habitsList: {
    gap: 8,
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  habitRowCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  removeAudioText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '700',
  },
  recordAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderStyle: 'dashed',
    paddingVertical: 14,
    gap: 8,
  },
  recordAudioText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#818CF8',
  },
  notesInput: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    fontSize: 14,
    color: '#F8FAFC',
    lineHeight: 22,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#F8FAFC',
  },
  addTagBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  addTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#818CF8',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
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
  tagChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A5B4FC',
  },
});
