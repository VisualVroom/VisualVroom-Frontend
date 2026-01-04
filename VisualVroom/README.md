# VisualVroom

A React Native mobile application that enhances driving safety by detecting and alerting users to important traffic sounds like horns, sirens, and speech.

## Overview

VisualVroom uses real-time audio processing to detect critical sounds while driving, providing visual alerts to help drivers stay aware of their surroundings. The app is particularly useful for:

- Drivers who listen to music at high volumes
- Individuals with hearing impairments
- Enhanced situational awareness in busy traffic

## Features

- **Real-time Audio Detection**: Monitors ambient sounds for horns, sirens, and speech
- **Visual Alerts**: Provides clear visual notifications when important sounds are detected
- **Onboarding Experience**: First-time user walkthrough
- **Dashboard Interface**: Clean, intuitive main interface
- **Persistent Settings**: Remembers user preferences using AsyncStorage

## Tech Stack

- **Framework**: React Native 0.81.5 with Expo 54
- **React**: 19.1.0
- **Audio Processing**: Expo AV
- **Storage**: @react-native-async-storage/async-storage
- **Platform Support**: iOS, Android, and Web

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Expo CLI
- For iOS development: macOS with Xcode
- For Android development: Android Studio

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd VisualVroom-Frontend/VisualVroom
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

## Running the App

### iOS
```bash
npm run ios
# or
yarn ios
```

### Android
```bash
npm run android
# or
yarn android
```

### Web
```bash
npm run web
# or
yarn web
```

## Project Structure

```
VisualVroom/
├── assets/              # Images, icons, and media files
│   ├── dashboard/      # Dashboard-related assets
│   └── onboarding/     # Onboarding screen assets
├── components/         # React components
│   ├── Onboarding.js  # First-time user experience
│   └── Dashboard.js   # Main app interface
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── App.js             # Main application entry point
├── app.json           # Expo configuration
└── package.json       # Project dependencies
```

## Permissions

The app requires the following permissions:

### iOS
- **Microphone Access**: Required to detect traffic sounds
  - Purpose: "VisualVroom needs microphone access to detect traffic sounds like horns, sirens, and speech for your safety while driving."

### Android
- **RECORD_AUDIO**: Required for audio detection

## Configuration

The app configuration is managed in `app.json`:
- App name and slug
- Version information
- Platform-specific settings
- Icon and splash screen configuration
- Permission declarations

## Development

### Key Components

- **App.js**: Main application logic, handles onboarding flow
- **Onboarding**: First-time user experience
- **Dashboard**: Primary user interface after onboarding

### Storage

The app uses AsyncStorage to persist:
- Onboarding completion status
- User preferences (future feature)

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## License

0BSD - Zero-Clause BSD License

## Version

Current version: 1.0.0

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please open an issue in the repository.

---

**Note**: This app is designed as a safety aid and should not replace attentive driving practices. Always maintain focus on the road and follow local traffic laws.
