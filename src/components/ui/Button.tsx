import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Haptics } from '../../utils/haptics';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'success';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  testID,
  accessibilityLabel,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    if (variant === 'destructive') {
      Haptics.notificationAsync('warning');
    } else {
      Haptics.selectionAsync();
    }
    onPress();
  };

  const getVariantContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'destructive':
        return styles.destructiveContainer;
      case 'ghost':
        return styles.ghostContainer;
      case 'success':
        return styles.successContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'destructive':
        return styles.destructiveText;
      case 'ghost':
        return styles.ghostText;
      case 'success':
        return styles.successText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseContainer,
        getVariantContainerStyle(),
        disabled && styles.disabledContainer,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'ghost' ? '#38BDF8' : '#FFFFFF'}
        />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text
            style={[
              styles.baseText,
              getVariantTextStyle(),
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  baseText: {
    fontSize: 14,
    fontWeight: '700',
  },
  primaryContainer: {
    backgroundColor: '#6366F1', // Indigo primary
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryContainer: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryText: {
    color: '#E2E8F0',
  },
  destructiveContainer: {
    backgroundColor: '#DC2626',
  },
  destructiveText: {
    color: '#FFFFFF',
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#818CF8',
  },
  successContainer: {
    backgroundColor: '#10B981',
  },
  successText: {
    color: '#FFFFFF',
  },
  disabledContainer: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.8,
  },
});

