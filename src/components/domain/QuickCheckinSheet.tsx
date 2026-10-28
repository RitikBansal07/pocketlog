import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JournalEntry } from '../../types/domain';
import { Haptics } from '../../utils/haptics';

interface QuickCheckinSheetProps {
  visible: boolean;
  todayEntry?: JournalEntry;
  onClose: () => void;
  onToggleHabit: (habitId: string) => void;
  onOpenFullEditor: () => void;
}

export const QuickCheckinSheet: React.FC<QuickCheckinSheetProps> = ({
  visible,
  todayEntry,
  onClose,
  onToggleHabit,
  onOpenFullEditor,
}) => {
  const handleHabitPress = (habitId: string) => {
    Haptics.impactAsync('medium');
    onToggleHabit(habitId);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetCard}>
          {/* Grab Handle */}
          <View style={styles.grabHandle} />

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Quick Daily Check-In</Text>
              <Text style={styles.subTitle}>
                {todayEntry ? todayEntry.date : 'Log today’s habits'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {todayEntry ? (
            <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionLabel}>TODAY’S HABITS</Text>
              <View style={styles.habitsList}>
                {todayEntry.habits.map((habit) => (
                  <TouchableOpacity
                    key={habit.id}
                    style={[
                      styles.habitRow,
                      habit.completed && styles.habitRowCompleted,
                    ]}
                    onPress={() => handleHabitPress(habit.id)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.habitLeft}>
                      <Ionicons
                        name={habit.completed ? 'checkmark-circle' : (habit.icon as any)}
                        size={20}
                        color={habit.completed ? '#10B981' : '#64748B'}
                      />
                      <Text
                        style={[
                          styles.habitLabel,
                          habit.completed && styles.habitLabelCompleted,
                        ]}
                      >
                        {habit.label}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.checkCircle,
                        habit.completed && styles.checkCircleCompleted,
                      ]}
                    >
                      {habit.completed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.fullEditorBtn}
                onPress={() => {
                  onClose();
                  onOpenFullEditor();
                }}
              >
                <Text style={styles.fullEditorText}>Open Full Reflection Editor</Text>
                <Ionicons name="arrow-forward" size={14} color="#818CF8" />
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <View style={styles.noTodayWrap}>
              <Text style={styles.noTodayText}>No journal log created for today yet.</Text>
              <TouchableOpacity
                style={styles.createTodayBtn}
                onPress={() => {
                  onClose();
                  onOpenFullEditor();
                }}
              >
                <Text style={styles.createTodayBtnText}>Create Today’s Log</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 15, 25, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    maxHeight: '80%',
  },
  grabHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flexShrink: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  habitsList: {
    gap: 8,
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  habitRowCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  habitLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  habitLabelCompleted: {
    color: '#34D399',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  fullEditorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    gap: 6,
    paddingVertical: 10,
  },
  fullEditorText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#818CF8',
  },
  noTodayWrap: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noTodayText: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 16,
  },
  createTodayBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createTodayBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
