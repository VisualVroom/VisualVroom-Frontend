import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

const ONBOARDING_KEY = '@onboarding_complete';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setShowOnboarding(value === null);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  if (showOnboarding === null) {
    return null;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard />;
}
