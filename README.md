# Catch On - React Native Mobile App

A modern fitness and wellness mobile application built with React Native, featuring video streaming, meditation sessions, and personalized workout tracking.

## Features

- 🎥 Video streaming with adaptive quality
- 🧘 Guided meditation and relaxation sessions
- 💪 Personalized workout programs
- 📊 Progress tracking and analytics
- 🌍 Multi-language support (EN, RU)
- 🔐 Secure authentication with email verification
- 🎨 Beautiful and intuitive UI/UX
- 📱 Works on Android and iOS

## Tech Stack

- **React Native** 0.75.3
- **React Navigation** 6.x
- **Redux** for state management
- **Axios** for API communication
- **i18next** for internationalization
- **React Native Vector Icons** for icons

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js >= 18
- npm or Yarn 3.6.4
- Android Studio (for Android development)
- Xcode (for iOS development)
- React Native CLI

## Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Installation

1. **Install dependencies:**

```bash
npm install --legacy-peer-deps
# or
yarn install
```

2. **Start Metro Bundler:**

```bash
npm start
# or
yarn start
```

3. **In a new terminal, run the app:**

### For Android

```bash
npm run android
# or
yarn android
```

### For iOS

```bash
npm run ios
# or
yarn ios
```

## Project Structure

```
src/
├── screens/          # App screens
├── components/       # Reusable components
├── hooks/           # Custom React hooks
├── services/        # API and utility services
├── redux/           # Redux store, actions, reducers
├── assets/          # Images, fonts, etc.
├── config/          # App configuration
└── i18n/            # Internationalization files

android/            # Android native code
ios/                # iOS native code
```

## Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Build and run on Android emulator
- `npm run ios` - Build and run on iOS simulator
- `npm run build` - Build Android bundle
- `npm run build-ios` - Build iOS bundle
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Configuration

### API Configuration

Update the API base URL in `src/config.index.js`:

```javascript
export default {
  baseUrl: 'https://your-api-domain.com/api',
  // ... other config
};
```

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://your-api-domain.com/api
DEBUG_MODE=false
```

## Building for Production

### Android Release APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`

### iOS Release Build

```bash
npm run build-ios
```

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Android Build Issues

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### iOS Build Issues

```bash
cd ios
pod install
cd ..
npm run ios
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@catchon.app or open an issue on GitHub.

## Acknowledgments

- Built with [React Native](https://reactnative.dev)
- UI Components from [React Native Community](https://github.com/react-native-community)
- Icons from [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
