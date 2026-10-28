import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioMemo } from '../../types/domain';
import { Haptics } from '../../utils/haptics';

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
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleStartRecording = () => {
    Haptics.impactAsync('medium');
    setIsRecording(true);
    setSecondsElapsed(0);
  };

  const handleStopAndSave = () => {
    Haptics.notificationAsync('success');
    setIsRecording(false);

    // Generate 16 sample amplitude heights for waveform visualization
    const heights = Array.from({ length: 16 }, () => Math.floor(Math.random() * 70) + 30);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMemo: AudioMemo = {
      id: `aud-${Date.now()}`,
      uri: `file://reflection-memo-${Date.now()}.m4a`,
      durationSec: Math.max(3, secondsElapsed),
      recordedAt: timeStr,
      waveformHeights: heights,
    };

    onSave(newMemo);
    onClose();
  };

  const handleCancel = () => {
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
            <TouchableOpacity onPress={handleCancel}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subText}>
            Speak your thoughts, daily gratitude, or audio stream of consciousness.
          </Text>

          {/* Mic Button & Ripple */}
          <View style={styles.micContainer}>
            <TouchableOpacity
              style={[styles.micBtn, isRecording && styles.micBtnRecording]}
              onPress={isRecording ? handleStopAndSave : handleStartRecording}
              accessibilityRole="button"
              accessibilityLabel={isRecording ? 'Stop recording voice reflection' : 'Start recording'}
              testID="mic-record-btn"
            >
              <Ionicons
                name={isRecording ? 'stop' : 'mic'}
                size={34}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Text style={styles.timerText}>{formatSecs(secondsElapsed)}</Text>
            <Text style={styles.statusText}>
              {isRecording ? 'Recording audio reflection... Tap to finish.' : 'Tap microphone to speak'}
            </Text>
          </View>

          {/* Cancel button */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
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
    marginBottom: 20,
  },
  micContainer: {
    alignItems: 'center',
    paddingVertical: 14,
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
    color: '#64748B',
    marginTop: 4,
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
