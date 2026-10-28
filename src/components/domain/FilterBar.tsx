import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EntryFilterParams, MoodScore } from '../../types/domain';
import { MOOD_DEFINITIONS } from './MoodSelector';
import { Haptics } from '../../utils/haptics';

interface FilterBarProps {
  filterParams: EntryFilterParams;
  availableTags: string[];
  onChange: (params: EntryFilterParams) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterParams,
  availableTags,
  onChange,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (text: string) => {
    onChange({ ...filterParams, searchQuery: text });
  };

  const handleDateRangeChange = (range: '7D' | '30D' | '90D' | 'ALL') => {
    Haptics.selectionAsync();
    onChange({ ...filterParams, dateRange: range });
  };

  const toggleMood = (score: MoodScore) => {
    Haptics.selectionAsync();
    const current = filterParams.selectedMoods;
    const next = current.includes(score) ? current.filter((s) => s !== score) : [...current, score];
    onChange({ ...filterParams, selectedMoods: next });
  };

  const toggleTag = (tag: string) => {
    Haptics.selectionAsync();
    const current = filterParams.selectedTags;
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    onChange({ ...filterParams, selectedTags: next });
  };

  const hasActiveFilters =
    filterParams.dateRange !== 'ALL' ||
    filterParams.selectedMoods.length > 0 ||
    filterParams.selectedTags.length > 0 ||
    (filterParams.searchQuery && filterParams.searchQuery.length > 0);

  return (
    <View style={styles.container} testID="filter-bar">
      {/* Search Input Bar */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrap}>
          <Ionicons name="search" size={16} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reflections, habits, or tags..."
            placeholderTextColor="#64748B"
            value={filterParams.searchQuery || ''}
            onChangeText={handleSearchChange}
            testID="search-input"
          />
          {filterParams.searchQuery ? (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Ionicons name="close-circle" size={16} color="#64748B" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.filterToggleBtn, showAdvanced && styles.filterToggleBtnActive]}
          onPress={() => setShowAdvanced(!showAdvanced)}
          accessibilityRole="button"
          accessibilityLabel="Toggle filter menu"
        >
          <Ionicons
            name={showAdvanced ? 'options' : 'options-outline'}
            size={18}
            color={showAdvanced ? '#6366F1' : '#94A3B8'}
          />
        </TouchableOpacity>
      </View>

      {/* Date Range Chips Row */}
      <View style={styles.dateRow}>
        {(['7D', '30D', '90D', 'ALL'] as const).map((range) => {
          const isSelected = filterParams.dateRange === range;
          return (
            <TouchableOpacity
              key={range}
              style={[styles.dateChip, isSelected && styles.dateChipActive]}
              onPress={() => handleDateRangeChange(range)}
              testID={`date-filter-${range}`}
            >
              <Text style={[styles.dateChipText, isSelected && styles.dateChipTextActive]}>
                {range === 'ALL' ? 'All Time' : `Past ${range}`}
              </Text>
            </TouchableOpacity>
          );
        })}

        {hasActiveFilters && (
          <TouchableOpacity style={styles.resetBtn} onPress={onReset} testID="reset-filters-btn">
            <Ionicons name="refresh" size={12} color="#EF4444" />
            <Text style={styles.resetBtnText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Advanced Filters Expand */}
      {showAdvanced && (
        <View style={styles.advancedBox}>
          {/* Mood Filter */}
          <Text style={styles.sectionLabel}>FILTER BY MOOD</Text>
          <View style={styles.moodRow}>
            {([1, 2, 3, 4, 5] as MoodScore[]).map((score) => {
              const item = MOOD_DEFINITIONS[score];
              const isSelected = filterParams.selectedMoods.includes(score);
              return (
                <TouchableOpacity
                  key={score}
                  style={[styles.moodChip, isSelected && styles.moodChipActive]}
                  onPress={() => toggleMood(score)}
                >
                  <Text style={styles.moodEmoji}>{item.emoji}</Text>
                  <Text style={[styles.moodLabel, isSelected && styles.moodLabelActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>FILTER BY TAGS</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
                {availableTags.map((tag) => {
                  const isSelected = filterParams.selectedTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tagFilterChip, isSelected && styles.tagFilterChipActive]}
                      onPress={() => toggleTag(tag)}
                    >
                      <Text
                        style={[
                          styles.tagFilterText,
                          isSelected && styles.tagFilterTextActive,
                        ]}
                      >
                        #{tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#F8FAFC',
  },
  filterToggleBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterToggleBtnActive: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dateChipActive: {
    backgroundColor: '#4338CA',
    borderColor: '#6366F1',
  },
  dateChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  dateChipTextActive: {
    color: '#FFFFFF',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: 3,
    paddingHorizontal: 6,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  advancedBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 10,
  },
  moodChip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  moodChipActive: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  moodEmoji: {
    fontSize: 14,
  },
  moodLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  moodLabelActive: {
    color: '#818CF8',
    fontWeight: '800',
  },
  tagsScroll: {
    flexDirection: 'row',
  },
  tagFilterChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tagFilterChipActive: {
    backgroundColor: '#312E81',
    borderColor: '#6366F1',
  },
  tagFilterText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tagFilterTextActive: {
    color: '#A5B4FC',
    fontWeight: '700',
  },
});
