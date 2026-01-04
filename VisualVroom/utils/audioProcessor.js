import * as FileSystem from 'expo-file-system';

// Extract audio data from a recording file
// Note: This is a simplified version. Full implementation would require
// native modules or additional libraries for proper audio decoding
export async function extractAudioChunk(fileUri, startMs = 0, durationMs = 1500) {
  try {
    if (!fileUri) {
      console.warn('No file URI provided for audio chunk extraction');
      return null;
    }

    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      console.warn('Audio file does not exist:', fileUri);
      return null;
    }

    // For now, return metadata about the chunk
    // Full implementation would decode audio and extract samples
    return {
      uri: fileUri,
      startMs,
      durationMs,
      size: fileInfo.size,
      exists: fileInfo.exists,
    };
  } catch (error) {
    console.error('Error extracting audio chunk:', error);
    return null;
  }
}

// Prepare audio data for TensorFlow Lite model
// This function would convert raw audio to the format expected by the ML model
export function prepareForMLModel(audioChunk) {
  if (!audioChunk) {
    return null;
  }

  // Placeholder for ML model preprocessing
  // In a full implementation, this would:
  // 1. Decode audio file to raw PCM samples
  // 2. Resample to 16kHz if needed
  // 3. Convert to mono if needed
  // 4. Normalize to -1 to 1 range (Float32Array)
  // 5. Apply any required preprocessing (windowing, etc.)

  return {
    // Mock data structure for ML model
    data: new Float32Array(16000 * 1.5), // 1.5 seconds at 16kHz
    sampleRate: 16000,
    duration: 1.5,
    channels: 1,
    timestamp: Date.now(),
  };
}

// Clean up old audio chunks to prevent memory issues
export async function cleanupOldChunks(fileUri, keepLastN = 3) {
  try {
    if (!fileUri) {
      return;
    }

    // Get directory containing the recording
    const directory = fileUri.substring(0, fileUri.lastIndexOf('/'));

    // List all files in the directory
    const files = await FileSystem.readDirectoryAsync(directory);

    // Filter for audio files
    const audioFiles = files.filter(file =>
      file.endsWith('.m4a') || file.endsWith('.wav') || file.endsWith('.mp3')
    );

    // Sort by modification time (would need getInfoAsync for each file)
    // For now, just keep the last N files alphabetically
    if (audioFiles.length > keepLastN) {
      const filesToDelete = audioFiles.slice(0, audioFiles.length - keepLastN);

      for (const file of filesToDelete) {
        const filePath = `${directory}/${file}`;
        try {
          await FileSystem.deleteAsync(filePath, { idempotent: true });
          console.log('Deleted old audio chunk:', file);
        } catch (err) {
          console.warn('Could not delete file:', file, err);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up old chunks:', error);
  }
}

// Format audio chunk information for logging and debugging
export function formatChunkInfo(chunk) {
  if (!chunk) {
    return 'No chunk data';
  }

  return {
    uri: chunk.uri || 'N/A',
    duration: `${(chunk.durationMillis / 1000).toFixed(2)}s`,
    timestamp: new Date(chunk.timestamp).toLocaleTimeString(),
    sampleRate: `${chunk.sampleRate}Hz`,
    channels: chunk.channels,
  };
}

// Validate audio chunk for ML model compatibility
export function validateChunk(chunk) {
  if (!chunk) {
    return { valid: false, errors: ['Chunk is null or undefined'] };
  }

  const errors = [];

  if (!chunk.uri) {
    errors.push('Missing URI');
  }

  if (chunk.sampleRate !== 16000) {
    errors.push(`Invalid sample rate: ${chunk.sampleRate} (expected 16000)`);
  }

  if (chunk.channels !== 1) {
    errors.push(`Invalid channel count: ${chunk.channels} (expected 1 for mono)`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
