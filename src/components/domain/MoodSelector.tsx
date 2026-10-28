import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MoodScore } from '../../types/domain';
import { Haptics } from '../../utils/haptics';

interface MoodSelectorProps {
  value: MoodScore;
  onChange: (val: MoodScore) => void;
  label?: string;
}

export const MOOD_DEFINITIONS: Record<
  MoodScore,
  { emoji: string; label: string; color: string }
> = {
  1: { emoji: '😫', label: 'Terrible', color: '#EF4444' },
  2: { emoji: '😔', label: 'Down', color: '#F97316' },
  3: { emoji: '😐', label: 'Neutral', color: '#FBBF24' },
  4: { emoji: '😊', label: 'Good', color: '#10B981' },
  5: { emoji: '🤩', label: 'Radiant', color: '#6366F1' },
};

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  value,
  onChange,
  label = 'How are you feeling today?',
}) => {
  const handleSelect = (score: MoodScore) => {
    Haptics.impactAsync('light');
    onChange(score);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.title}>{label}</Text> : null}
      <View style={styles.row}>
        {([1, 2, 3, 4, 5] as MoodScore[]).map((score) => {
          const item = MOOD_DEFINITIONS[score];
          const isSelected = value === score;
          return (
            <TouchableOpacity
              key={score}
              style={[
                styles.item,
                isSelected && { borderColor: item.color, backgroundColor: 'rgba(99, 102, 241, 0.15)' },
              ]}
              onPress={() => handleSelect(score)}
              activeOpacity={0.75}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${item.label} mood`}
              testID={`mood-option-${score}`}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text
                style={[
                  styles.label,
                  isSelected ? { color: item.color, fontWeight: '800' } : styles.labelUnselected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  emoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
  },
  labelUnselected: {
    color: '#94A3B8',
    fontWeight: '600',
  },
});
