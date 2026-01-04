import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export default function useAudioPermissions() {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const { status } = await Audio.getPermissionsAsync();
      setPermissionStatus(status);
      return status === 'granted';
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return false;
    }
  };

  const requestPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        setShowPermissionModal(true);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      setShowPermissionModal(true);
      return false;
    }
  };

  return {
    permissionStatus,
    checkPermission,
    requestPermission,
    showPermissionModal,
    setShowPermissionModal,
  };
}
