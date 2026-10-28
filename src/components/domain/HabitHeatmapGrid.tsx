import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HeatmapDay } from '../../types/domain';
import { Haptics } from '../../utils/haptics';

interface HabitHeatmapGridProps {
  days: HeatmapDay[];
  onSelectDay?: (day: HeatmapDay) => void;
}

const INTENSITY_COLORS = {
  0: '#1E293B', // Inactive
  1: '#312E81', // 25%
  2: '#4338CA', // 50%
  3: '#6366F1', // 75%
  4: '#818CF8', // 100%
};

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const HabitHeatmapGrid: React.FC<HabitHeatmapGridProps> = ({ days, onSelectDay }) => {
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);

  const handlePressCell = (day: HeatmapDay) => {
    Haptics.selectionAsync();
    setSelectedDay(day);
    if (onSelectDay) onSelectDay(day);
  };

  // Group days into columns of 7 (weeks)
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <View style={styles.card} testID="habit-heatmap-grid">
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>30-DAY HABIT COMPLETION MATRIX</Text>
          <Text style={styles.subTitle}>Activity density & consistency tracking</Text>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <Text style={styles.legendText}>Less</Text>
          {([0, 1, 2, 3, 4] as const).map((lvl) => (
            <View key={lvl} style={[styles.legendBox, { backgroundColor: INTENSITY_COLORS[lvl] }]} />
          ))}
          <Text style={styles.legendText}>More</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        {/* Day of Week Labels */}
        <View style={styles.dayLabelsCol}>
          {DAY_LABELS.map((lbl, idx) => (
            <Text key={idx} style={styles.dayLabel}>
              {lbl}
            </Text>
          ))}
        </View>

        {/* Matrix Columns */}
        <View style={styles.matrixRow}>
          {weeks.map((week, wIdx) => (
            <View key={wIdx} style={styles.weekCol}>
              {week.map((day) => {
                const isSelected = selectedDay?.date === day.date;
                return (
                  <TouchableOpacity
                    key={day.date}
                    style={[
                      styles.cell,
                      { backgroundColor: INTENSITY_COLORS[day.intensity] },
                      isSelected && styles.cellSelected,
                    ]}
                    onPress={() => handlePressCell(day)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`${day.date}: ${day.completedCount} of ${day.totalHabits} habits completed`}
                    testID={`heatmap-cell-${day.date}`}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Tooltip detail bar if tapped */}
      {selectedDay && (
        <View style={styles.tooltipBar}>
          <Text style={styles.tooltipDate}>{selectedDay.date}</Text>
          <Text style={styles.tooltipStats}>
            {selectedDay.totalHabits > 0
              ? `${selectedDay.completedCount} / ${selectedDay.totalHabits} habits completed (${Math.round(
                  (selectedDay.completedCount / selectedDay.totalHabits) * 100
                )}%)`
              : 'No log recorded on this day'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  legendBox: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayLabelsCol: {
    marginRight: 8,
    gap: 6,
  },
  dayLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    height: 16,
    textAlignVertical: 'center',
  },
  matrixRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    gap: 6,
  },
  weekCol: {
    flex: 1,
    gap: 6,
  },
  cell: {
    height: 16,
    borderRadius: 3,
  },
  cellSelected: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tooltipBar: {
    marginTop: 12,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  tooltipDate: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  tooltipStats: {
    fontSize: 11,
    color: '#A5B4FC',
    fontWeight: '600',
  },
});
