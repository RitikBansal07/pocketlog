import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Haptics } from '../../utils/haptics';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  badge?: string | number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  badge,
  style,
  textStyle,
  testID,
}) => {
  const handlePress = () => {
    if (onPress) {
      Haptics.selectionAsync();
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={!onPress}
      testID={testID}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected }}
    >
      {icon ? <>{icon}</> : null}
      <Text
        style={[
          styles.chipText,
          selected ? styles.chipTextSelected : styles.chipTextUnselected,
          textStyle,
        ]}
      >
        {label}
      </Text>
      {badge !== undefined ? (
        <Text style={[styles.badge, selected ? styles.badgeSelected : styles.badgeUnselected]}>
          {badge}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipUnselected: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  chipSelected: {
    backgroundColor: '#4338CA',
    borderColor: '#6366F1',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextUnselected: {
    color: '#94A3B8',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
  },
  badgeUnselected: {
    backgroundColor: '#0F172A',
    color: '#94A3B8',
  },
  badgeSelected: {
    backgroundColor: '#312E81',
    color: '#A5B4FC',
  },
});

