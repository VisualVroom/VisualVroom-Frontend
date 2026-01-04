import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import OnboardingScreen from './OnboardingScreen';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: "See What You Can't Hear",
    description: 'Receive real-time visual alerts for sirens, horns, and approaching vehicles. Stay aware of your surroundings without relying on hearing.',
    image: require('../assets/onboarding/screen1.png'),
  },
  {
    id: '2',
    title: 'Feel the Warning,\nSee the Direction',
    description: 'Your smartwatch provides immediate haptic feedback to keep your eyes on the road. Glance at your phone only when necessary to identify the sound source.',
    image: require('../assets/onboarding/screen2.png'),
  },
  {
    id: '3',
    title: 'Seamless In-Car\nCommunication',
    description: 'Instantly convert passenger speech into text overlay. Enjoy conversations safely without turning your head.',
    image: require('../assets/onboarding/screen3.png'),
  },
];

const Onboarding = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      onComplete?.();
    }
  };

  const handleSkip = () => {
    onComplete?.();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item, index }) => (
    <OnboardingScreen
      title={item.title}
      description={item.description}
      image={item.image}
      onSkip={handleSkip}
      onNext={handleNext}
      isLastScreen={index === onboardingData.length - 1}
    />
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            currentIndex === index && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={32}
      />
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#6B57F2',
    width: 24,
  },
});

export default Onboarding;
