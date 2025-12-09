import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Text from '../components/Text';
import styles from '../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import i18n from 'i18next';
import AsyncStorage from '@react-native-community/async-storage';
import apiClient from '../services/api';
import {CommonActions} from '@react-navigation/native';
import * as RootNavigation from '../services/RootNavigation';

const languages = [
  {code: 'en-US', name: 'English'},
  {code: 'ru-RU', name: 'Русский'},
  {code: 'uk-UA', name: 'Українська'},
  {code: 'es-ES', name: 'Español'},
  {code: 'zh-CN', name: '中文'},
];

export default function LanguageModal({visible, onClose, currentLanguage}) {
  const {t} = useTranslation();
  const Api = apiClient();
  const width = Dimensions.get('window').width;

  const handleLanguageChange = async (languageCode) => {
    try {
      // Сохраняем локально
      await AsyncStorage.setItem('language', languageCode);
      // Сохраняем на сервере
      await Api.post('/api/user/settings-update', {
        localization: languageCode,
      });
      // Меняем язык в приложении
      await i18n.changeLanguage(languageCode);
      console.log(`Язык изменен на ${languageCode}`);
      // Закрываем модалку
      onClose();
      // Принудительно сбрасываем навигацию для перерисовки всех экранов
      setTimeout(() => {
        if (RootNavigation.navigationRef.isReady()) {
          RootNavigation.navigationRef.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'MainStack'}],
            })
          );
        }
      }, 300);
    } catch (error) {
      console.error('Ошибка при смене языка:', error);
    }
  };

  if (!visible) return null;

  return (
    <View style={localStyles.container}>
      <BlurView
        style={localStyles.blurView}
        blurType="light"
        blurAmount={3}
        reducedTransparencyFallbackColor="rgba(255,255,255,0.2)">
        <TouchableOpacity
          style={localStyles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
      </BlurView>

      <View style={localStyles.modalContent}>
        <Text style={localStyles.title}>
          SELECT{'\n'}LANGUAGE
        </Text>

        <View style={localStyles.languageList}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                localStyles.languageItem,
                currentLanguage === language.code && localStyles.languageItemActive,
              ]}
              onPress={() => handleLanguageChange(language.code)}>
              <Text style={localStyles.languageName}>
                {language.name}
              </Text>
              {currentLanguage === language.code && (
                <Ionicons
                  name="checkmark"
                  size={28}
                  color={styles.colors.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    width: Dimensions.get('window').width,
    height: '100%',
    justifyContent: 'flex-end',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: styles.paddingHorizontal,
    paddingTop: 30,
    paddingBottom: 10,
  },
  title: {
    color: styles.colors.black,
    fontSize: styles.fonSize.h1,
    fontFamily: 'StretchPro',
    fontWeight: '1000',
    marginBottom: 20,
    lineHeight: styles.fonSize.h1 * 1.2,
  },
  languageList: {
    width: '100%',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  languageItemActive: {
    backgroundColor: '#ECF4F4',
  },
  languageName: {
    fontSize: styles.fonSize.lg,
    fontFamily: 'SF-Pro-Display-Regular',
    fontWeight: '400',
    color: styles.colors.black,
  },
});

