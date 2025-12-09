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
import {usePasswordRecovery} from '../hooks/usePasswordRecovery';
import {useTranslation} from 'react-i18next';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';

function PasswordRecovery({navigation}) {
  const {t} = useTranslation();
  let lang = useTranslation().i18n.language
  console.log(lang)
  const {step, formData, errors, handleInputChange, handleSubmit} =
    usePasswordRecovery();
  const {email, code, password, confirmed_password} = formData;

  const textByStep = step => {
    switch (step) {
      case 0:
        return t('Recover password');
      case 1:
        return t('Create');
      default:
        return '';
    }
  };

  return (
    <KeyboardAvoidingScrollView
      contentContainerStyle={{
        minHeight: Dimensions.get('window').height,
        alignItems: 'flex-start',
        backgroundColor: styles.colors.background,
      }}
      style={{
        height: Dimensions.get('window').height,
        backgroundColor: styles.colors.background,
      }}>
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
        onPress={() => navigation.pop()}>
        <Ionicons
          name="chevron-back-outline"
          size={styles.fonSize.h1}
          color={styles.colors.gray5}
        />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          paddingTop: 90,
          justifyContent: 'flex-start',
          gap: 25,
          padding: 16,
        }}>
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.g1,
            fontWeight: '1000',
            textAlign: 'left',
            width: '100%',
          }}>
          {step == 0 ?t("RECOVER PASSWORD"):t("CREATE NEW PASSWORD")}
        </Text>

        {step == 0 && (
          <Text
            style={{
              color: styles.colors.regular,
              fontSize: styles.fonSize.md,
              fontWeight: '300',
              textAlign: 'left',
              width: '100%',
            }}>
            {t('recovery_text')}
          </Text>
        )}

        {step == 1 && (
          <Text
            style={{
              color: styles.colors.regular,
              fontSize: styles.fonSize.md,
              fontWeight: '300',
              textAlign: 'left',
              width: '100%',
            }}>
            {t('recovery_code_text').split("////")[0]}
            <Text
              style={{
                color: styles.colors.black,
                fontSize: styles.fonSize.md,
                fontWeight: '500',
                textAlign: 'left',
                width: '100%',
              }}>
              {email}
            </Text>
            {t('recovery_code_text').split('////')[1]}
          </Text>
        )}

        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}>
          {step === 0 && (
            <View style={{width: '100%'}}>
              <StandardInput
                value={email}
                autoComplete="email"
                onChange={val => handleInputChange('email', val)}
                placeholder={`${t('Your')} ${t('Email')}`}
                size="md"
                width="100%"
                error={errors?.find(e => e.path === 'email')?.message || null}
              />
            </View>
          )}
          {step === 1 && (
            <View style={{width: '100%', gap: 10}}>
              <StandardInput
                value={code}
                onChange={val =>
                  val.length < 5 && handleInputChange('code', val)
                }
                mode="decimal"
                placeholder={`${t('Code')}`}
                size="md"
                width="100%"
                error={errors?.find(e => e.path === 'code')?.message || null}
              />
              <Text
                style={{
                  color: styles.colors.regular,
                  fontSize: styles.fonSize.md,
                  fontWeight: '300',
                  textAlign: 'left',
                  width: '100%',
                  marginTop:10
                }}>
                {t('recovery_password_text')}
              </Text>
              <StandardInput
                value={password}
                onChange={val => handleInputChange('password', val)}
                placeholder={`${t('Password')}`}
                size="md"
                width="100%"
                secureTextEntry
                error={errors?.find(e => e.path === 'password')?.message || null}
              />
              <StandardInput
                value={confirmed_password}
                onChange={val => handleInputChange('confirmed_password', val)}
                placeholder={`${t('Repit your password')}`}
                size="md"
                width="100%"
                secureTextEntry
                error={errors?.find(e => e.path === 'confirmed_password')?.message || null}
              />
            </View>
          )}
          <StandardButton
            title={textByStep(step)}
            action={handleSubmit}
            style={{}}
          />
        </View>
      </View>
      <View style={{height: 80}}></View>
    </KeyboardAvoidingScrollView>
  );
}

export default PasswordRecovery;
