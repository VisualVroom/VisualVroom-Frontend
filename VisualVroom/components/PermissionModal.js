import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';

export default function PermissionModal({ visible, onClose }) {
  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.micIcon}>
              <View style={styles.micBody} />
              <View style={styles.micBottom} />
            </View>
          </View>

          <Text style={styles.title}>Microphone Access Required</Text>

          <Text style={styles.message}>
            VisualVroom needs microphone access to detect traffic sounds like horns, sirens, and speech for your safety while driving.
          </Text>

          <Text style={styles.instructions}>
            Please enable microphone access in your device settings to use this feature.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={openSettings}>
            <Text style={styles.primaryButtonText}>Open Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FCFCFC',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8E5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  micIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBody: {
    width: 24,
    height: 36,
    backgroundColor: '#6B57F2',
    borderRadius: 12,
  },
  micBottom: {
    width: 36,
    height: 5,
    backgroundColor: '#6B57F2',
    borderRadius: 2.5,
    marginTop: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E0E62',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#5A5A58',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 12,
  },
  instructions: {
    fontSize: 14,
    color: '#5A5A58',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#6B57F2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6B57F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6B57F2',
    fontSize: 16,
    fontWeight: '600',
  },
});
