import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Haptics } from '../../utils/haptics';
import { audioEngine } from '../../utils/audioEngine';

interface WaveformBarProps {
  uri?: string;
  waveformHeights: number[];
  durationSec: number;
  recordedAt?: string;
}

export const WaveformBar: React.FC<WaveformBarProps> = ({
  uri = '',
  waveformHeights,
  durationSec,
  recordedAt,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const activePlaybackRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    return () => {
      if (activePlaybackRef.current) {
        activePlaybackRef.current.stop();
      }
    };
  }, []);

  const togglePlay = () => {
    Haptics.selectionAsync();

    if (isPlaying) {
      if (activePlaybackRef.current) {
        activePlaybackRef.current.stop();
        activePlaybackRef.current = null;
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setCurrentProgress(0);

      const playback = audioEngine.playAudio(
        uri,
        (progress) => {
          setCurrentProgress(progress);
        },
        () => {
          setIsPlaying(false);
          setCurrentProgress(0);
          activePlaybackRef.current = null;
        }
      );

      activePlaybackRef.current = playback;
    }
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
        testID="waveform-play-btn"
      >
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.waveformWrap}>
        <View style={styles.barsRow}>
          {waveformHeights.map((h, idx) => {
            const isActive = idx <= activeIndex && isPlaying;
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
            {isPlaying
              ? formatTime(currentProgress * durationSec)
              : formatTime(durationSec)}
          </Text>
          <View style={styles.liveTagRow}>
            {isPlaying ? (
              <View style={styles.playingTag}>
                <View style={styles.playingDot} />
                <Text style={styles.playingTagText}>Playing voice</Text>
              </View>
            ) : recordedAt ? (
              <Text style={styles.recordedAtText}>Recorded at {recordedAt}</Text>
            ) : null}
          </View>
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
  liveTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  playingTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34D399',
  },
  recordedAtText: {
    fontSize: 10,
    color: '#64748B',
  },
});
