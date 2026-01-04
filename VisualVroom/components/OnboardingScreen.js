import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ title, description, image, onSkip, onNext, isLastScreen }) => {
  return (
    <View style={styles.container}>
      {/* Main Illustration */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        {isLastScreen ? (
          <TouchableOpacity style={styles.startButton} onPress={onNext}>
            <Text style={styles.startButtonText}>Start VisualVroom</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>›</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    width: width,
    paddingHorizontal: 25,
    paddingTop: 0,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    marginBottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 16,
    lineHeight: 30,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#5A5A58',
    lineHeight: 18,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 60,
  },
  skipButton: {
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 40,
    minWidth: 70,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#101010',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#6B57F2',
    width: 50,
    height: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#6B57F2',
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 40,
    flex: 1,
    marginLeft: 16,
  },
  startButtonText: {
    fontSize: 16,
    color: '#F1F1F1',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OnboardingScreen;
