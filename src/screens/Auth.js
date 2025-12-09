import React from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Text from '../components/Text';
import styles from '../styles';
import StandardButton from '../components/StandardButton';
import StandardInput from '../components/StandardInput';
import {useAuth} from '../hooks/useAuth';
import {useTranslation} from 'react-i18next';

function Auth({navigation}) {
  const {formData, errors, handleInputChange, handleSubmit} = useAuth();
  const {email, password} = formData;
  const {t} = useTranslation();

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{
        height: Dimensions.get('window').height,
        alignItems: 'center',
        backgroundColor: styles.colors.background,
      }}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.push('Registration')}>
        <Text
          style={{
            color: styles.colors.regular,
            fontSize: styles.fonSize.h2,
            fontWeight: '500',
          }}>
          {t('Registration')}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          width: '90%',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: 20,
          paddingTop: 80,
        }}>
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.g2,
            fontWeight: '1000',
          }}>
          {t('Auth').toUpperCase()}
        </Text>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{width: '100%', gap: 15}}>
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
              value={password}
              onChange={val => handleInputChange('password', val)}
              placeholder={`${t('Password')}`}
              size="md"
              width="100%"
              secureTextEntry
              error={errors?.find(e => e.path === 'password')?.message || null}
            />

            <StandardButton
              title={t('Login')}
              action={handleSubmit}
              style={{padding: 5}}
            />
          </View>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={() => navigation.push('PasswordRecovery')}>
              <Text
                style={{
                  color: styles.colors.dark,
                  fontSize: styles.fonSize.smd,
                  textDecorationLine: 'underline',
                }}>
                {t('Forgot password')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
          <TouchableOpacity onPress={() => navigation.push('Registration')}>
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
    </KeyboardAvoidingView>
  );
}

export default Auth;
