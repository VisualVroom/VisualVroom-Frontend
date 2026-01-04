import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';
import {
  getRecordingOptions,
  METERING_INTERVAL_MS,
  normalizeAudioLevel,
  CHUNK_DURATION_MS,
  MAX_RECORDING_DURATION_MS
} from '../utils/audioConfig';

export default function useAudioRecorder({ onAudioChunk, onError } = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState(null);

  const recordingRef = useRef(null);
  const meteringIntervalRef = useRef(null);
  const chunkIntervalRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(getRecordingOptions());
      await recording.startAsync();

      recordingRef.current = recording;
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setError(null);

      // Start metering interval for visualization
      meteringIntervalRef.current = setInterval(async () => {
        if (recordingRef.current) {
          try {
            const status = await recordingRef.current.getStatusAsync();
            if (status.isRecording && status.metering !== undefined) {
              const normalized = normalizeAudioLevel(status.metering);
              setAudioLevel(normalized);
            }
          } catch (err) {
            console.error('Error getting metering status:', err);
          }
        }
      }, METERING_INTERVAL_MS);

      // Start duration tracking
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setRecordingDuration(elapsed);

        // Stop recording if max duration reached
        if (elapsed >= MAX_RECORDING_DURATION_MS) {
          stopRecording();
          Alert.alert(
            'Recording Stopped',
            'Maximum recording duration reached (1 hour).',
            [{ text: 'OK' }]
          );
        }
      }, 1000);

      // Start chunk processing interval
      chunkIntervalRef.current = setInterval(async () => {
        if (recordingRef.current && onAudioChunk) {
          try {
            const uri = recordingRef.current.getURI();
            const status = await recordingRef.current.getStatusAsync();

            if (uri && status.isRecording) {
              const chunk = {
                uri,
                durationMillis: status.durationMillis,
                timestamp: Date.now(),
                sampleRate: 16000,
                channels: 1,
              };

              onAudioChunk(chunk);
            }
          } catch (err) {
            console.error('Error processing audio chunk:', err);
          }
        }
      }, CHUNK_DURATION_MS);

      return true;
    } catch (err) {
      console.error('Failed to start recording:', err);
      const errorMessage = 'Could not start audio recording. Please check microphone permissions.';

      setError({
        type: 'RECORDING_FAILED',
        message: errorMessage,
        originalError: err,
      });

      if (onError) {
        onError(err);
      } else {
        Alert.alert(
          'Recording Error',
          'Unable to start audio recording. Please try again or check your device settings.',
          [{ text: 'OK' }]
        );
      }

      setIsRecording(false);
      return false;
    }
  };

  const stopRecording = async () => {
    try {
      // Clear all intervals
      if (meteringIntervalRef.current) {
        clearInterval(meteringIntervalRef.current);
        meteringIntervalRef.current = null;
      }

      if (chunkIntervalRef.current) {
        clearInterval(chunkIntervalRef.current);
        chunkIntervalRef.current = null;
      }

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      // Stop and unload recording
      if (recordingRef.current) {
        const status = await recordingRef.current.getStatusAsync();

        if (status.isRecording) {
          await recordingRef.current.stopAndUnloadAsync();
        }

        recordingRef.current = null;
      }

      // Reset state
      setIsRecording(false);
      setAudioLevel(0);
      setRecordingDuration(0);
      startTimeRef.current = null;

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  const pauseRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.pauseAsync();

        // Pause intervals
        if (meteringIntervalRef.current) {
          clearInterval(meteringIntervalRef.current);
          meteringIntervalRef.current = null;
        }
        if (chunkIntervalRef.current) {
          clearInterval(chunkIntervalRef.current);
          chunkIntervalRef.current = null;
        }
      }
    } catch (err) {
      console.error('Error pausing recording:', err);
    }
  };

  return {
    isRecording,
    recordingDuration,
    audioLevel,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
  };
}
