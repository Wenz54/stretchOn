import React from 'react';
import {View, TouchableOpacity, Dimensions, Keyboard} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Text from '../components/Text';
import StandardButton from '../components/StandardButton';
import StandardButtonOutline from '../components/StandardButtonOutline';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import {useKeyboardVisible} from '../hooks/useKeyboardVisible';

export default LogoutModal = ({hide = () => {}, handleLogout = () => {}}) => {
  const width = Dimensions.get('window').width;
  const {t} = useTranslation();
  const isKeyboardVisible = useKeyboardVisible();

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 999,
        width,
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
      <BlurView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        blurType="light"
        blurAmount={3}
        reducedTransparencyFallbackColor="rgba(255,255,255,0.2)">
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
          }}
          onPress={() => (!isKeyboardVisible ? hide() : Keyboard.dismiss())}
        />
      </BlurView>
      <View
        style={{
          width: '100%',
          maxHeight: '60%',
          backgroundColor: '#fff',
          alignItems: 'center',
          padding: styles.paddingHorizontal,
          justifyContent: 'space-around',
          paddingVertical: 30,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}>
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.g1,
            fontWeight: '1000',
            width: '100%',
            textAlign: 'left',
            marginBottom: 10,
          }}>
          {t('LOG OUT').toUpperCase()}
        </Text>
        <Text
          style={{
            color: styles.colors.regular,
            fontSize: styles.fonSize.md,
            fontWeight: '400',
            width: '100%',
            textAlign: 'left',
            marginBottom: 20,
          }}>
          {t('Are you sure you want to exit?')}
        </Text>

        <StandardButton
          style={{
            padding: 5,
            paddingHorizontal: styles.paddingHorizontal,
            backgroundColor: styles.colors.primary,
            marginBottom: 20,
          }}
          title={t('Cancel')}
          action={hide}
        />
        <StandardButtonOutline 
          title={t('Log out')} 
          action={handleLogout} 
        />
      </View>
    </View>
  );
};

