import React from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Text from '../components/Text';
import styles from '../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StandardButton from '../components/StandardButton';
import StandardInput from '../components/StandardInput';
import {useRegistration} from '../hooks/useRegistration';
import {useTranslation} from 'react-i18next';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import CodeInput from '../components/CodeInput';

function Registration({navigation}) {
  const {step, formData, errors, stepBack, handleInputChange, handleSubmit} =
    useRegistration();
  const {email, name, password, confirmed_password, code, promocode} = formData;
  const {t} = useTranslation();

  return (
    <KeyboardAvoidingScrollView
      contentContainerStyle={{
        alignItems: 'flex-start',
        minHeight: Dimensions.get('window').height,
        backgroundColor: styles.colors.background,
      }}
      style={{
        height: Dimensions.get('window').height,
        backgroundColor: styles.colors.background,
      }}>
      {step == 0 && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.push('Login')}>
          <Text
            style={{
              color: styles.colors.regular,
              fontSize: styles.fonSize.h2,
              fontWeight: '500',
            }}>
            {t('Auth')}
          </Text>
        </TouchableOpacity>
      )}
      {step == 1 && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            backgroundColor: '#000',
            borderRadius: 50,
            width: 48,
            height: 48,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => stepBack()}>
          <Ionicons
            name="chevron-back-outline"
            size={styles.fonSize.h1}
            color={styles.colors.gray5}
          />
        </TouchableOpacity>
      )}

      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 20,
          paddingTop: 80,
        }}>
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.g2,
            fontWeight: '1000',
            width: '90%',
            textAlign: 'left',
          }}>
          {t('Registration').toUpperCase()}
        </Text>
        {step == 1 && (
          <Text
            style={{
              color: styles.colors.regular,
              fontSize: styles.fonSize.md,
              fontWeight: '300',
              textAlign: 'left',
              width: '90%',
            }}>
            {t('recovery_code_text').split('////')[0]}
            <Text
              style={{
                color: styles.colors.black,
                fontSize: styles.fonSize.md,
                fontWeight: '500',
                textAlign: 'left',
                width: '100%',
              }}>
              {formData.email}
            </Text>
            {t('recovery_code_text').split('////')[1]}
          </Text>
        )}
        <View
          style={{
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}>
          {step == 0 && (
            <View style={{width: '100%', gap: 10}}>
              <StandardInput
                value={email}
                mode="email"
                autoComplete="email"
                onChange={val => handleInputChange('email', val)}
                placeholder={`${t('Your')} ${t('Email')}`}
                size="md"
                width="100%"
                error={errors?.find(e => e.path === 'email')?.message || null}
              />

              <StandardInput
                value={name}
                mode="text"
                onChange={val => handleInputChange('name', val)}
                placeholder={`${t('Username')}`}
                size="md"
                width="100%"
                error={errors?.find(e => e.path === 'name')?.message || null}
              />

              <StandardInput
                value={password}
                onChange={val => handleInputChange('password', val)}
                placeholder={`${t('Password')}`}
                size="md"
                width="100%"
                secureTextEntry
                error={
                  errors?.find(e => e.path === 'password')?.message || null
                }
              />

              <StandardInput
                value={confirmed_password}
                onChange={val => handleInputChange('confirmed_password', val)}
                placeholder={`${t('Confirm password')}`}
                size="md"
                width="100%"
                secureTextEntry
                error={
                  errors?.find(e => e.path === 'confirmed_password')?.message ||
                  null
                }
              />
            </View>
          )}
          {step == 1 && (
            <View style={{width: '100%'}}>
              <CodeInput
                value={code}
                onChange={val => handleInputChange('code', val)}
                onCodeComplete={()=>handleSubmit()}
                error={errors?.find(e => e.path === 'code')?.message || null}
              />
            </View>
          )}

          {step == 0 && (
            <StandardButton
              title={t('Register')}
              action={handleSubmit}
              style={{padding: 5}}
            />
          )}
        </View>
      </View>
     
     {step == 0 && (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          height: 80,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: styles.colors.regular,
              fontSize: styles.fonSize.smd,
            }}>
            {t('terms_privacy_text').split('////')[0]}
          </Text>
          <TouchableOpacity onPress={() => navigation.push('Auth')}>
            <Text
              style={{
                color: styles.colors.regular,
                fontSize: styles.fonSize.smd,
                textDecorationLine: 'underline',
              }}>
              {t('terms')}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: styles.colors.regular,
              fontSize: styles.fonSize.smd,
            }}>
            {t('terms_privacy_text').split('////')[1]}
          </Text>
          <TouchableOpacity onPress={() => navigation.push('Registration')}>
            <Text
              style={{
                color: styles.colors.regular,
                fontSize: styles.fonSize.smd,
                textDecorationLine: 'underline',
              }}>
              {t('privacy')}
            </Text>
          </TouchableOpacity>
        </View>
        </View>
     )}
      
      
    </KeyboardAvoidingScrollView>
  );
}

export default Registration;
