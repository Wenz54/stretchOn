# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js >= 18
- npm or Yarn
- Android Studio (for Android)
- Xcode (for iOS)

### Installation

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start Metro bundler
npm start

# 3. In another terminal, run on Android
npm run android

# Or run on iOS
npm run ios
```

## 📁 Project Structure

```
src/
├── screens/          # App screens (Login, Registration, Home, etc.)
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── services/        # API calls and utilities
├── redux/           # State management
├── assets/          # Images, fonts, icons
├── config/          # App configuration
└── lang/            # Localization files
```

## 🔧 Available Commands

```bash
npm start              # Start Metro bundler
npm run android        # Run on Android emulator
npm run ios           # Run on iOS simulator
npm run build         # Build Android bundle
npm run build-ios     # Build iOS bundle
npm run lint          # Run ESLint
npm test              # Run tests
```

## 🌐 API Configuration

Edit `src/config.index.js`:

```javascript
export default {
  baseUrl: 'https://your-api.com/api',
  isDev: false,
  enableDevLogin: false,
  // ...
};
```

## 🔐 Environment Variables

Create `.env` file:

```env
API_BASE_URL=https://your-api.com/api
DEBUG_MODE=false
```

## 📱 Testing

### Android
```bash
# Start emulator
emulator -avd emulator-5554

# Run app
npm run android
```

### iOS
```bash
# Run on simulator
npm run ios

# Or open Xcode
open ios/CatchOn.xcworkspace
```

## 🐛 Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Android build issues
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### iOS build issues
```bash
cd ios
pod install
cd ..
npm run ios
```

## 📚 Documentation

- **README.md** - Full documentation
- **CONTRIBUTING.md** - How to contribute
- **PUBLISHING.md** - App store publishing
- **GIT_SETUP.md** - Git initialization
- **CHANGELOG.md** - Version history

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Start Metro bundler
3. ✅ Run on emulator/simulator
4. ✅ Make changes
5. ✅ Test on device
6. ✅ Create pull request

## 💡 Tips

- Use `Ctrl+M` (Android) or `Cmd+M` (iOS) to open dev menu
- Press `R` twice to reload app
- Use Redux DevTools for debugging
- Check console logs for errors

## 🆘 Need Help?

- Check README.md
- Check CONTRIBUTING.md
- Open GitHub issue
- Email: support@catchon.app

---

Happy coding! 🎉
