# Publishing Guide for Catch On

This guide covers how to prepare and publish Catch On to Google Play Store and Apple App Store.

## Prerequisites

- Google Play Developer Account ($25 one-time fee)
- Apple Developer Account ($99/year)
- Signing certificates and keys
- App Store Connect access

## Android Publishing

### 1. Generate Signing Key

```bash
cd android/app

# Generate keystore
keytool -genkey -v -keystore catch_on.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias catch_on

# You'll be prompted for:
# - Keystore password
# - Key password
# - Your name, organization, etc.
```

**Important:** Save the keystore file and passwords in a secure location!

### 2. Configure Gradle for Signing

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('catch_on.keystore')
            storePassword 'your_keystore_password'
            keyAlias 'catch_on'
            keyPassword 'your_key_password'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Build Release APK

```bash
cd android
./gradlew assembleRelease
```

The signed APK will be at: `app/build/outputs/apk/release/app-release.apk`

### 4. Build Release Bundle (Recommended)

```bash
./gradlew bundleRelease
```

The bundle will be at: `app/build/outputs/bundle/release/app-release.aab`

### 5. Upload to Google Play

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Fill in app details:
   - App name: "Catch On"
   - Default language: English
   - App category: Health & Fitness
4. Complete all required sections:
   - App access
   - Ads
   - Content rating questionnaire
   - Target audience
5. Upload the AAB file to "Production" release
6. Review and publish

## iOS Publishing

### 1. Create App ID

1. Go to [Apple Developer](https://developer.apple.com)
2. Create a new App ID: `com.catch_on`
3. Enable necessary capabilities:
   - Push Notifications
   - HealthKit (if needed)
   - HomeKit (if needed)

### 2. Create Certificates

1. Create a Certificate Signing Request (CSR) in Keychain Access
2. Create an iOS App Development certificate
3. Create an iOS App Distribution certificate
4. Download and install certificates

### 3. Create Provisioning Profiles

1. Create Development provisioning profile
2. Create Distribution provisioning profile
3. Download and install profiles

### 4. Update Xcode Project

1. Open `ios/CatchOn.xcworkspace`
2. Select the project in Xcode
3. Go to Signing & Capabilities
4. Select your team
5. Update bundle identifier to `com.catch_on`
6. Update version number and build number

### 5. Build for Release

```bash
cd ios

# Build for archive
xcodebuild -workspace CatchOn.xcworkspace \
  -scheme CatchOn \
  -configuration Release \
  -derivedDataPath build \
  -archivePath build/CatchOn.xcarchive \
  archive
```

### 6. Create IPA

```bash
xcodebuild -exportArchive \
  -archivePath build/CatchOn.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/
```

### 7. Upload to App Store

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app
3. Fill in app information:
   - Name: "Catch On"
   - Primary language: English
   - Category: Health & Fitness
4. Complete all required sections:
   - App information
   - Pricing and availability
   - App privacy
   - Screenshots and preview
   - Description
   - Keywords
   - Support URL
5. Upload the IPA using Transporter or Xcode
6. Submit for review

## Pre-Launch Checklist

- [ ] Version number updated
- [ ] Build number incremented
- [ ] All features tested on real devices
- [ ] No console errors or warnings
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Screenshots prepared (Android: 1080x1920px, iOS: 1242x2208px)
- [ ] App icon finalized
- [ ] Splash screen updated
- [ ] All strings localized
- [ ] Performance optimized
- [ ] Battery usage optimized
- [ ] Network requests optimized
- [ ] Security review completed
- [ ] Permissions justified

## App Store Optimization (ASO)

### Keywords
- Fitness
- Meditation
- Workout
- Health
- Wellness
- Yoga
- Exercise
- Relaxation

### Description
Craft a compelling description that highlights:
- Key features
- Benefits
- Target audience
- Unique selling points

### Screenshots
- Show main features
- Use attractive visuals
- Include text overlays
- Highlight benefits

## Post-Launch

1. Monitor reviews and ratings
2. Fix bugs reported by users
3. Respond to user feedback
4. Plan updates and new features
5. Monitor analytics
6. Optimize based on user behavior

## Troubleshooting

### Android Issues

**Build fails with "Keystore not found"**
- Ensure keystore file is in the correct location
- Check file path in build.gradle

**APK too large**
- Enable ProGuard/R8 minification
- Remove unused dependencies
- Use App Bundle instead of APK

### iOS Issues

**Code signing errors**
- Verify certificates are installed
- Check provisioning profiles
- Ensure bundle identifier matches

**App rejected**
- Review App Store guidelines
- Check privacy policy
- Ensure all required screens are present

## Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://help.apple.com/app-store-connect)
- [React Native Publishing Guide](https://reactnative.dev/docs/signed-apk-android)
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

## Support

For questions about publishing, contact:
- support@catchon.app
- GitHub Issues

---

Last updated: December 2024
