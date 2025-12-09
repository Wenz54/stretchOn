import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json'; // Английский (США)
import ru from './ru.json'; // Русский (Россия)
import ua from './ua.json'; // Украинский (Украина)
import es from './sp.json'; // Испанский (Испания)
import zh from './ch.json'; // Китайский (Китай)
import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

// Функция для получения сохраненного языка из AsyncStorage
const getSavedLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('language');
    return savedLanguage || null; // Возвращаем сохраненный язык или null, если его нет
  } catch (error) {
    console.error('Ошибка при получении языка из AsyncStorage:', error);
    return null;
  }
};

// Функция для инициализации i18next
const initializeI18n = async () => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

  // Получаем сохраненный язык
  const savedLanguage = await getSavedLanguage();

  // Определяем язык для инициализации
  const lng = savedLanguage || deviceLanguage.split('_')[0] || 'en-US';

  const resources = {
    'en-US': en, // Английский (США)
    'ru-RU': ru, // Русский (Россия)
    'uk-UA': ua, // Украинский (Украина)
    'es-ES': es, // Испанский (Испания)
    'zh-CN': zh, // Китайский (Китай)
  };

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: lng, // Используем сохраненный язык, язык устройства или английский по умолчанию
    fallbackLng: 'en-US', // Язык по умолчанию, если выбранный язык недоступен
    interpolation: {
      escapeValue: false, // Не экранировать HTML-теги в переводах
    },
  });
};

initializeI18n();

export default { i18n };