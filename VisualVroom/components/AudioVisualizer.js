import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function AudioVisualizer({ audioLevel, isRecording }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isRecording && audioLevel !== undefined) {
      // Animate scale based on audio level
      // audioLevel is 0-1, we want to scale from 1.0 to 1.3
      const targetScale = 1 + (audioLevel * 0.3);

      Animated.timing(pulseAnim, {
        toValue: targetScale,
        duration: 50,
        useNativeDriver: true,
      }).start();

      // Animate opacity based on audio level
      const targetOpacity = 0.3 + (audioLevel * 0.4);

      Animated.timing(opacityAnim, {
        toValue: targetOpacity,
        duration: 50,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset to default when not recording
      Animated.parallel([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [audioLevel, isRecording]);

  if (!isRecording) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Outer ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.outerRing,
          {
            transform: [{ scale: pulseAnim }],
            opacity: opacityAnim,
          },
        ]}
      />

      {/* Middle ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.middleRing,
          {
            transform: [{ scale: Animated.multiply(pulseAnim, 0.85) }],
            opacity: Animated.multiply(opacityAnim, 1.2),
          },
        ]}
      />

      {/* Inner ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.innerRing,
          {
            transform: [{ scale: Animated.multiply(pulseAnim, 0.7) }],
            opacity: Animated.multiply(opacityAnim, 1.4),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 248.741,
    height: 248.741,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: '#6B57F2',
  },
  outerRing: {
    width: 248.741,
    height: 248.741,
  },
  middleRing: {
    width: 200,
    height: 200,
    borderWidth: 3,
  },
  innerRing: {
    width: 150,
    height: 150,
    borderWidth: 2.5,
  },
});
