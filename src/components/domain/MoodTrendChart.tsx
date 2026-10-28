import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { JournalEntry } from '../../types/domain';
import { MOOD_DEFINITIONS } from './MoodSelector';
import { Haptics } from '../../utils/haptics';

interface MoodTrendChartProps {
  entries: JournalEntry[];
}

export const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ entries }) => {
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Take the most recent 7 non-archived entries sorted chronologically
  const recentEntries = [...entries]
    .filter((e) => !e.isArchived)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(-7);

  if (recentEntries.length < 2) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>MOOD & ENERGY TRAJECTORY</Text>
        <Text style={styles.emptyNotice}>Log at least 2 entries to display mood trend line.</Text>
      </View>
    );
  }

  const width = 320;
  const height = 140;
  const paddingX = 24;
  const paddingY = 20;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate points (x, y) for mood (1 to 5)
  const stepX = chartWidth / (recentEntries.length - 1);
  const points = recentEntries.map((e, idx) => {
    const x = paddingX + idx * stepX;
    // Map mood (1..5) to Y (height..0)
    const normalizedY = (e.mood - 1) / 4;
    const y = paddingY + (1 - normalizedY) * chartHeight;
    return { x, y, entry: e };
  });

  // Construct SVG Bezier / Line Path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  // Construct Gradient Area path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${
    height - paddingY
  } Z`;

  const selectedPoint =
    selectedPointIndex !== null ? points[selectedPointIndex] : points[points.length - 1];

  return (
    <View style={styles.card} testID="mood-trend-chart">
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>MOOD & ENERGY TRAJECTORY</Text>
          <Text style={styles.subTitle}>7-Day emotional cadence</Text>
        </View>

        {selectedPoint && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedEmoji}>
              {MOOD_DEFINITIONS[selectedPoint.entry.mood].emoji}
            </Text>
            <Text style={styles.selectedLabel}>
              {MOOD_DEFINITIONS[selectedPoint.entry.mood].label} (Energy: {selectedPoint.entry.energyLevel}/5)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.svgWrap}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Horizontal Grid lines */}
          {[1, 2, 3, 4, 5].map((level) => {
            const y = paddingY + (1 - (level - 1) / 4) * chartHeight;
            return (
              <Line
                key={level}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fill */}
          <Path d={areaD} fill="url(#gradientArea)" />

          {/* Curve Line */}
          <Path d={pathD} fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isSelected = selectedPointIndex === idx;
            return (
              <Circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 6 : 4}
                fill={isSelected ? '#FFFFFF' : '#818CF8'}
                stroke="#6366F1"
                strokeWidth={isSelected ? 3 : 2}
              />
            );
          })}
        </Svg>
      </View>

      {/* Date ticks under points */}
      <View style={styles.ticksRow}>
        {points.map((pt, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.tickBtn}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedPointIndex(idx);
            }}
          >
            <Text
              style={[
                styles.tickDateText,
                selectedPointIndex === idx && styles.tickDateTextActive,
              ]}
            >
              {pt.entry.date.slice(-5)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    alignItems: 'center',
    marginBottom: 8,
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
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  selectedEmoji: {
    fontSize: 14,
  },
  selectedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  svgWrap: {
    alignItems: 'center',
  },
  emptyNotice: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
  ticksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 4,
  },
  tickBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tickDateText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  tickDateTextActive: {
    color: '#818CF8',
    fontWeight: '800',
  },
});

