import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioMemo } from '../../types/domain';
import { Haptics } from '../../utils/haptics';
import { audioEngine } from '../../utils/audioEngine';

interface AudioMemoRecorderProps {
  visible: boolean;
  onClose: () => void;
  onSave: (memo: AudioMemo) => void;
}

export const AudioMemoRecorder: React.FC<AudioMemoRecorderProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [liveMeterBars, setLiveMeterBars] = useState<number[]>([15, 20, 25, 20, 15]);
  const liveIntervalRef = useRef<any>(null);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);

      // Sample live mic audio levels every 120ms for visual meter
      liveIntervalRef.current = setInterval(() => {
        const level = audioEngine.getLiveAudioLevel();
        setLiveMeterBars([
          Math.max(12, level * 0.4),
          Math.max(16, level * 0.7),
          Math.max(22, level * 1.0),
          Math.max(28, level * 0.9),
          Math.max(20, level * 0.6),
          Math.max(14, level * 0.35),
        ]);
      }, 120);
    } else {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    }

    return () => {
      clearInterval(timer);
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    Haptics.impactAsync('medium');
    setIsRecording(true);
    setSecondsElapsed(0);
    try {
      await audioEngine.startRecording();
    } catch (e) {
      console.warn('Error starting recording:', e);
    }
  };

  const handleStopAndSave = async () => {
    Haptics.notificationAsync('success');
    setIsRecording(false);
    setIsProcessing(true);

    try {
      const result = await audioEngine.stopRecording();

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newMemo: AudioMemo = {
        id: `aud-${Date.now()}`,
        uri: result.uri,
        durationSec: result.durationSec,
        recordedAt: timeStr,
        waveformHeights: result.waveformHeights,
      };

      onSave(newMemo);
      onClose();
    } catch (err) {
      console.warn('Failed to stop and encode audio recording:', err);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (isRecording) {
      audioEngine.stopRecording().catch(() => {});
    }
    setIsRecording(false);
    setSecondsElapsed(0);
    onClose();
  };

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.titleWrap}>
              <Ionicons name="mic" size={20} color="#6366F1" />
              <Text style={styles.title}>Voice Reflection Memo</Text>
            </View>
            <TouchableOpacity onPress={handleCancel} disabled={isProcessing}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subText}>
            Speak clearly into your microphone to record your voice. You can listen back right after saving.
          </Text>

          {/* Live Mic Meter */}
          {isRecording ? (
            <View style={styles.liveMeterRow}>
              {liveMeterBars.map((height, idx) => (
                <View key={idx} style={[styles.liveMeterBar, { height }]} />
              ))}
            </View>
          ) : null}

          {/* Mic Button & Ripple */}
          <View style={styles.micContainer}>
            <TouchableOpacity
              style={[
                styles.micBtn,
                isRecording && styles.micBtnRecording,
                isProcessing && { opacity: 0.6 },
              ]}
              onPress={isRecording ? handleStopAndSave : handleStartRecording}
              disabled={isProcessing}
              accessibilityRole="button"
              accessibilityLabel={isRecording ? 'Stop recording voice reflection' : 'Start recording'}
              testID="mic-record-btn"
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFFFFF" size="large" />
              ) : (
                <Ionicons
                  name={isRecording ? 'stop' : 'mic'}
                  size={34}
                  color="#FFFFFF"
                />
              )}
            </TouchableOpacity>

            <Text style={styles.timerText}>{formatSecs(secondsElapsed)}</Text>
            <Text style={styles.statusText}>
              {isProcessing
                ? 'Saving voice audio...'
                : isRecording
                ? '🔴 Recording live voice... Tap square to finish'
                : 'Tap microphone to speak'}
            </Text>
          </View>

          {/* Discard button */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
              disabled={isProcessing}
            >
              <Text style={styles.cancelBtnText}>Discard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 15, 25, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 16,
  },
  liveMeterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 36,
    marginBottom: 10,
  },
  liveMeterBar: {
    width: 6,
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  micContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  micBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 4,
  },
  micBtnRecording: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  timerText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F8FAFC',
    marginTop: 14,
    letterSpacing: 1,
  },
  statusText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    fontWeight: '600',
  },
  actionRow: {
    marginTop: 14,
    alignItems: 'center',
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelBtnText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
});
