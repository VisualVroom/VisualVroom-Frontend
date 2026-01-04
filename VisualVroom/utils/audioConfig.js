import { Audio } from 'expo-av';

// Audio configuration optimized for TensorFlow Lite model inference
// Format: 16kHz mono - industry standard for audio classification

export const getRecordingOptions = () => ({
  isMeteringEnabled: true,
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
});

// Chunk duration for continuous ML processing (1.5 seconds)
export const CHUNK_DURATION_MS = 1500;

// Maximum recording duration (1 hour)
export const MAX_RECORDING_DURATION_MS = 3600000;

// Audio level update interval for visualization (50ms = 20Hz)
export const METERING_INTERVAL_MS = 50;

// dB range for metering normalization
export const DB_MIN = -160;
export const DB_MAX = 0;

// Helper function to normalize audio level from dB to 0-1 scale
export const normalizeAudioLevel = (meteringDb) => {
  if (meteringDb === undefined || meteringDb === null) return 0;
  // Clamp between DB_MIN and DB_MAX, then normalize to 0-1
  const clamped = Math.max(DB_MIN, Math.min(DB_MAX, meteringDb));
  return (clamped - DB_MIN) / (DB_MAX - DB_MIN);
};
