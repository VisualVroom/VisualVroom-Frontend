import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import AudioVisualizer from './AudioVisualizer';
import PermissionModal from './PermissionModal';
import useAudioRecorder from '../hooks/useAudioRecorder';
import useAudioPermissions from '../hooks/useAudioPermissions';
import { formatChunkInfo, validateChunk } from '../utils/audioProcessor';

export default function Dashboard() {
  const [isWatchConnected, setIsWatchConnected] = useState(false);
  const [isSpeechToTextEnabled, setIsSpeechToTextEnabled] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Audio chunk handler for ML model integration
  const handleAudioChunk = (chunk) => {
    const validation = validateChunk(chunk);

    if (!validation.valid) {
      console.warn('Invalid audio chunk:', validation.errors);
      return;
    }

    const chunkInfo = formatChunkInfo(chunk);
    console.log('Audio chunk ready for ML:', chunkInfo);

    // Future: Pass to TensorFlow Lite model
    // const result = await runInference(chunk);
    // updateDetectionStats(result);
  };

  // Initialize audio recording hook
  const {
    isRecording,
    audioLevel,
    startRecording,
    stopRecording,
    error: recordingError,
  } = useAudioRecorder({
    onAudioChunk: handleAudioChunk,
  });

  // Initialize permissions hook
  const {
    requestPermission,
    showPermissionModal,
    setShowPermissionModal,
  } = useAudioPermissions();

  const handleWatchConnectionToggle = () => {
    setIsWatchConnected(!isWatchConnected);
  };

  const handleMonitoringToggle = async () => {
    if (!isMonitoring) {
      // Starting monitoring
      const hasPermission = await requestPermission();

      if (hasPermission) {
        const success = await startRecording();
        if (success) {
          setIsMonitoring(true);
        }
      }
    } else {
      // Stopping monitoring
      await stopRecording();
      setIsMonitoring(false);
    }
  };

  const handleSpeechToTextToggle = () => {
    setIsSpeechToTextEnabled(!isSpeechToTextEnabled);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Watch Connection Status Bar */}
      {!isWatchConnected && (
        <TouchableOpacity
          style={styles.disconnectedBanner}
          onPress={handleWatchConnectionToggle}
        >
          <View style={styles.disconnectedIndicator} />
          <Text style={styles.disconnectedText}>
            Watch Disconnected - <Text style={styles.tapToPairText}>Tap to Pair</Text>
          </Text>
        </TouchableOpacity>
      )}

      {/* Header */}
      <View style={styles.header}>
        {isWatchConnected && (
          <View style={styles.connectedStatus}>
            <View style={styles.connectedIndicator} />
            <Text style={styles.connectedText}>Watch Connected</Text>
          </View>
        )}

        <TouchableOpacity style={styles.settingsButton}>
          <Image
            source={require('../assets/dashboard/sliders.svg')}
            style={styles.settingsIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.instructionText}>
          Tap the button to start monitoring
        </Text>

        {/* Monitoring Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.monitoringButton}
            onPress={handleMonitoringToggle}
          >
            <View style={styles.outerRing} />
            <View style={[styles.middleRing, isMonitoring && styles.middleRingActive]} />

            {/* Audio Visualizer */}
            {isMonitoring && (
              <AudioVisualizer audioLevel={audioLevel} isRecording={isRecording} />
            )}

            <View style={styles.innerCircle}>
              <View style={styles.microphoneIcon}>
                <View style={styles.micBody} />
                <View style={styles.micBottom} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Speech-to-Text Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Speech-to-text</Text>
          <TouchableOpacity
            style={[
              styles.toggle,
              isSpeechToTextEnabled ? styles.toggleOn : styles.toggleOff
            ]}
            onPress={handleSpeechToTextToggle}
          >
            <View style={[
              styles.toggleCircle,
              isSpeechToTextEnabled && styles.toggleCircleOn
            ]} />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Recent Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>You traveled</Text>
            <Text style={styles.infoValue}>
              <Text style={styles.infoValueBold}>123</Text>
              <Text style={styles.infoPrimary}>km</Text>
              <Text style={styles.infoText}> last week.</Text>
            </Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>We detected</Text>
            <Text style={styles.infoValue}>
              <Text style={styles.infoPrimary}>3</Text>
              <Text style={styles.infoText}> Horns </Text>
              <Text style={styles.infoPrimary}>2</Text>
              <Text style={styles.infoText}> Sirens </Text>
              <Text style={styles.infoPrimary}>2</Text>
              <Text style={styles.infoText}> Speech</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Permission Modal */}
      {showPermissionModal && (
        <PermissionModal
          visible={showPermissionModal}
          onClose={() => setShowPermissionModal(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  disconnectedBanner: {
    backgroundColor: '#EF5E61',
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 34,
  },
  disconnectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 20,
    backgroundColor: '#D64143',
    borderWidth: 1,
    borderColor: '#5A5A58',
    marginRight: 12,
  },
  disconnectedText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  tapToPairText: {
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  connectedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 20,
    backgroundColor: '#41D65F',
    borderWidth: 1,
    borderColor: '#5A5A58',
    marginRight: 8,
  },
  connectedText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  settingsButton: {
    width: 47,
    height: 47,
    borderRadius: 20,
    backgroundColor: '#FCFCFC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 11.1,
    elevation: 5,
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
    marginBottom: 0,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monitoringButton: {
    width: 292,
    height: 292,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 292,
    height: 292,
    borderRadius: 146,
    borderWidth: 2,
    borderColor: '#E8E5FF',
  },
  middleRing: {
    position: 'absolute',
    width: 248.741,
    height: 248.741,
    borderRadius: 124.37,
    backgroundColor: '#6B57F2',
    opacity: 0.1,
  },
  middleRingActive: {
    opacity: 0.3,
  },
  innerCircle: {
    width: 209.807,
    height: 209.807,
    borderRadius: 104.9,
    backgroundColor: '#1E0E62',
    justifyContent: 'center',
    alignItems: 'center',
  },
  microphoneIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBody: {
    width: 40,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  micBottom: {
    width: 60,
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
    marginTop: 8,
  },
  divider: {
    width: 179,
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 192,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  toggle: {
    width: 49,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: '#6B57F2',
    alignItems: 'flex-end',
  },
  toggleOff: {
    backgroundColor: '#D1D1D6',
    alignItems: 'flex-start',
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  toggleCircleOn: {
    marginRight: 0,
  },
  infoCard: {
    backgroundColor: '#FCFCFC',
    borderRadius: 20,
    padding: 20,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 11.1,
    elevation: 5,
    marginTop: 0,
  },
  infoSection: {
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    lineHeight: 30,
  },
  infoValueBold: {
    fontWeight: '700',
    color: '#6B57F2',
  },
  infoPrimary: {
    fontWeight: '700',
    color: '#6B57F2',
  },
  infoText: {
    color: '#000',
    fontWeight: '500',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 10,
  },
});
