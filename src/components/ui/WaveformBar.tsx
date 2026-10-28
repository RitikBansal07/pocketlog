import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Haptics } from '../../utils/haptics';

interface WaveformBarProps {
  waveformHeights: number[];
  durationSec: number;
  recordedAt?: string;
}

export const WaveformBar: React.FC<WaveformBarProps> = ({
  waveformHeights,
  durationSec,
  recordedAt,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1 / (durationSec * 10);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSec]);

  const togglePlay = () => {
    Haptics.selectionAsync();
    setIsPlaying(!isPlaying);
  };

  const activeIndex = Math.floor(currentProgress * waveformHeights.length);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.container} testID="waveform-bar">
      <TouchableOpacity
        style={styles.playBtn}
        onPress={togglePlay}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause voice reflection' : 'Play voice reflection'}
      >
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.waveformWrap}>
        <View style={styles.barsRow}>
          {waveformHeights.map((h, idx) => {
            const isActive = idx <= activeIndex;
            return (
              <View
                key={idx}
                style={[
                  styles.bar,
                  { height: Math.max(6, (h / 100) * 26) },
                  isActive ? styles.barActive : styles.barInactive,
                ]}
              />
            );
          })}
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>
            {isPlaying ? formatTime(currentProgress * durationSec) : formatTime(durationSec)}
          </Text>
          {recordedAt ? <Text style={styles.recordedAtText}>Recorded at {recordedAt}</Text> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformWrap: {
    flex: 1,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 28,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
  },
  barInactive: {
    backgroundColor: '#334155',
  },
  barActive: {
    backgroundColor: '#818CF8',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  recordedAtText: {
    fontSize: 10,
    color: '#64748B',
  },
});
