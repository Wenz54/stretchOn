import React from 'react';
import {
  View, TouchableOpacity,
  Dimensions,
  Keyboard
} from 'react-native';
import { useDispatch } from 'react-redux';
import Text from '../components/Text';
import StandardButton from '../components/StandardButton';
import StandardInput from '../components/StandardInput';
import styles from '../styles';
import { useTranslation } from 'react-i18next';
import { useChangePassword } from '../hooks/useChangePassword';
import { useKeyboardVisible } from '../hooks/useKeyboardVisible';
import {BlurView} from '@react-native-community/blur';
export default ChangePasswordModal = ({hide = () => {}}) => {
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {formData, errors, handleInputChange, handleSubmit, status} =
    useChangePassword();
  const {password, new_password, confirmed_password} = formData;
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
          gap: 20,
          paddingVertical: 20,
        }}>
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.h1,
            fontWeight: '1000',
            width:'100%'
          }}>
          {t('Change password').toUpperCase()}
        </Text>
        <StandardInput
          value={password}
          onChange={val => handleInputChange('password', val)}
          placeholder={` ${t('Old password')}`}
          size="md"
          width="100%"
          secureTextEntry
          error={errors?.find(e => e.path === 'password')?.message || null}

        />
        <StandardInput
          value={new_password}
          onChange={val => handleInputChange('new_password', val)}
          placeholder={` ${t('New password')}`}
          size="md"
          width="100%"
          secureTextEntry
          error={errors?.find(e => e.path === 'new_password')?.message || null}

        />

        <StandardInput
          value={confirmed_password}
          onChange={val => handleInputChange('confirmed_password', val)}
          placeholder={` ${t('Retype your password')}`}
          size="md"
          width="100%"
          secureTextEntry
          error={errors?.find(e => e.path === 'confirmed_password')?.message || null}

        />
        
        <StandardButton
          style={{
            padding: 5,
            paddingHorizontal: styles.paddingHorizontal,
            backgroundColor: styles.colors.primary,
            marginTop: 10,
          }}
          title={t('Save')}
          action={handleSubmit}
        />
        <Text
            style={{
              color: styles.colors.gray,
              fontSize: styles.fonSize.sm,
              marginBottom: 5,
            }}>
            {status}
          </Text>
      </View>
    </View>
  );
};
