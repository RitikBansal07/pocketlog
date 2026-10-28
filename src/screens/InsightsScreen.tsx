import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEntriesQuery, useStreakStatsQuery } from '../api/queries';
import { HabitHeatmapGrid } from '../components/domain/HabitHeatmapGrid';
import { MoodTrendChart } from '../components/domain/MoodTrendChart';
import { generateHeatmapGrid } from '../domain/heatmapCalculator';
import { MOOD_DEFINITIONS } from '../components/domain/MoodSelector';
import { MoodScore } from '../types/domain';

export const InsightsScreen: React.FC = () => {
  const { data: entries = [] } = useEntriesQuery();
  const { data: stats } = useStreakStatsQuery();

  const heatmapDays = useMemo(() => generateHeatmapGrid(entries, 28), [entries]);

  // Compute habit completion breakdown
  const habitStats = useMemo(() => {
    const counts: Record<string, { total: number; completed: number }> = {};
    const active = entries.filter((e) => !e.isArchived);

    active.forEach((entry) => {
      entry.habits.forEach((h) => {
        if (!counts[h.label]) {
          counts[h.label] = { total: 0, completed: 0 };
        }
        counts[h.label].total++;
        if (h.completed) counts[h.label].completed++;
      });
    });

    return Object.entries(counts).map(([label, val]) => ({
      label,
      total: val.total,
      completed: val.completed,
      pct: val.total > 0 ? Math.round((val.completed / val.total) * 100) : 0,
    }));
  }, [entries]);

  // Compute mood breakdown counts
  const moodBreakdown = useMemo(() => {
    const counts: Record<MoodScore, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const active = entries.filter((e) => !e.isArchived);
    active.forEach((e) => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    return counts;
  }, [entries]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.title}>Habit & Mood Intelligence</Text>
        <Text style={styles.subTitle}>Quantified personal wellness analytics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Streak & KPI Cards Row */}
        {stats && (
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <View style={styles.kpiIconWrap}>
                <Ionicons name="flame" size={20} color="#F97316" />
              </View>
              <Text style={styles.kpiVal}>{stats.currentStreakDays} Days</Text>
              <Text style={styles.kpiLabel}>Current Streak</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={[styles.kpiIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Ionicons name="checkmark-done" size={20} color="#10B981" />
              </View>
              <Text style={styles.kpiVal}>{stats.weeklyCompletionRatePercent}%</Text>
              <Text style={styles.kpiLabel}>Weekly Habit Rate</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={[styles.kpiIconWrap, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                <Ionicons name="book" size={20} color="#6366F1" />
              </View>
              <Text style={styles.kpiVal}>{stats.totalEntriesLogged}</Text>
              <Text style={styles.kpiLabel}>Total Logs</Text>
            </View>
          </View>
        )}

        {/* 30-Day GitHub Habit Heatmap */}
        <HabitHeatmapGrid days={heatmapDays} />

        {/* 7-Day Mood & Energy Curve */}
        <MoodTrendChart entries={entries} />

        {/* Habit Completion Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>HABIT CONSISTENCY BREAKDOWN</Text>
          {habitStats.map((item) => (
            <View key={item.label} style={styles.habitStatItem}>
              <View style={styles.habitStatHeader}>
                <Text style={styles.habitStatLabel}>{item.label}</Text>
                <Text style={styles.habitStatPct}>
                  {item.pct}% ({item.completed}/{item.total})
                </Text>
              </View>
              <View style={styles.progressBarWrap}>
                <View style={[styles.progressBarFill, { width: `${item.pct}%` }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Mood Distribution */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>MOOD DISTRIBUTION</Text>
          <View style={styles.moodDistRow}>
            {([5, 4, 3, 2, 1] as MoodScore[]).map((score) => {
              const def = MOOD_DEFINITIONS[score];
              const count = moodBreakdown[score];
              return (
                <View key={score} style={styles.moodDistCol}>
                  <Text style={styles.moodDistEmoji}>{def.emoji}</Text>
                  <Text style={styles.moodDistCount}>{count}</Text>
                  <Text style={styles.moodDistLabel}>{def.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  subTitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 40,
  },
  kpiRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 6,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  kpiIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  kpiVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  kpiLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  habitStatItem: {
    marginBottom: 12,
  },
  habitStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  habitStatLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  habitStatPct: {
    fontSize: 11,
    fontWeight: '800',
    color: '#818CF8',
  },
  progressBarWrap: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  moodDistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodDistCol: {
    alignItems: 'center',
    flex: 1,
  },
  moodDistEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  moodDistCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  moodDistLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
});

