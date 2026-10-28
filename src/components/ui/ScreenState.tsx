import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface ScreenStateProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: keyof typeof Ionicons.glyphMap;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const ScreenState: React.FC<ScreenStateProps> = ({
  loading = false,
  error = null,
  empty = false,
  emptyTitle = 'No Entries Yet',
  emptyMessage = 'Reflect on your day, track your habits, and log your thoughts.',
  emptyIcon = 'journal-outline',
  emptyActionLabel,
  onEmptyAction,
  onRetry,
  children,
}) => {
  if (loading) {
    return (
      <View style={styles.centerContainer} testID="loading-state">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading PocketLog...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer} testID="error-state">
        <View style={styles.errorIconCircle}>
          <Ionicons name="cloud-offline-outline" size={32} color="#EF4444" />
        </View>
        <Text style={styles.errorTitle}>Unable to Load Data</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        {onRetry ? (
          <Button
            title="Retry Connection"
            variant="secondary"
            onPress={onRetry}
            style={{ marginTop: 14 }}
            testID="retry-btn"
          />
        ) : null}
      </View>
    );
  }

  if (empty) {
    return (
      <View style={styles.centerContainer} testID="empty-state">
        <View style={styles.emptyIconCircle}>
          <Ionicons name={emptyIcon} size={36} color="#6366F1" />
        </View>
        <Text style={styles.emptyTitle}>{emptyTitle}</Text>
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        {emptyActionLabel && onEmptyAction ? (
          <Button
            title={emptyActionLabel}
            variant="primary"
            onPress={onEmptyAction}
            style={{ marginTop: 16 }}
            testID="empty-action-btn"
          />
        ) : null}
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    minHeight: 280,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  errorIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 18,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  emptyMessage: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
  },
});
