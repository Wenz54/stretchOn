import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { useSelector } from 'react-redux';
import HeaderBack from '../headers/HeaderBack';
import styles from '../styles';
import WebView from 'react-native-webview';
import config from '../config';

export default function WebPagePay({ navigation, route }) {
  const auth = useSelector((state) => state.auth);
  const [logged, setLogged] = useState(auth.logged);

  useEffect(() => {
    if (auth.logged !== logged) {
      navigation.pop();
    }
  }, [auth]);

  const uri = route.params.url;

  // Функция для обработки изменений URL
  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    console.log(url)
    // Если URL соответствует успешной оплате
    if (url.includes('/subscription/success')) {
      navigation.pop(); // Закрыть текущий экран
      navigation.navigate('PayResult', { success: true });
    }

    // Если URL соответствует отмене оплаты
    if (url.includes('/subscription/cancel')) {
      navigation.pop(); // Закрыть текущий экран
      navigation.navigate('PayResult', { success: false });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: styles.colors.background,
      }}>
      <HeaderBack action={() => navigation.pop()} />
      <WebView
        startInLoadingState={true}
        source={{ uri }}
        renderLoading={() => (
          <View style={{ height: '100%', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={styles.colors.primary} />
          </View>
        )}
        style={{
          height: '100%',
          width: Dimensions.get('window').width,
          flex: 1,
          alignItems: 'center',
          backgroundColor: styles.colors.background,
        }}
        onNavigationStateChange={handleNavigationStateChange} // Отслеживаем изменения URL
      />
    </View>
  );
}