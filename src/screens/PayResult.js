import React, {useEffect} from 'react';
import {
  View, Image,
  Dimensions
} from 'react-native';
import {useDispatch} from 'react-redux';
import styles from '../styles';
import Text from '../components/Text';
import apiClient from '../services/api';
import StandardButtonOutline from '../components/StandardButtonOutline';
import {useTranslation} from 'react-i18next';
const {width, height} = Dimensions.get('window');

export default function PayResult({navigation, route}) {
  const Api = apiClient();
  const dispatch = useDispatch();
  const {t} = useTranslation();

  useEffect(() => {
    if (route?.params?.success) {
      // Даем время на обработку webhook от Stripe (2-3 секунды)
      const refreshUserData = () => {
        Api.get('/api/user/get')
          .then(response => {
            if (response?.data?.result) {
              dispatch({
                type: 'SET_USER_DATA',
                payload: response.data.result,
              });
              console.log('✅ User data refreshed after payment');
            }
          })
          .catch(error => {
            console.log('Error refreshing user data:', error);
          });
      };

      // Обновляем сразу
      refreshUserData();
      
      // И еще раз через 2 секунды (на случай если webhook еще не отработал)
      const timer1 = setTimeout(refreshUserData, 2000);
      
      // И последний раз через 5 секунд
      const timer2 = setTimeout(refreshUserData, 5000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [route?.params?.success]);

  if (route?.params?.success) {
    return (
      <View
        style={{
          borderRadius: 16,
          width: '100%',
          backgroundColor: styles.colors.background,
          padding: 16,
          gap: 25,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={require('../images/ok_hand.png')} />
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.g1,
            fontWeight: '1000',
            width: '100%',
            textAlign: 'center',
          }}>
          {t('Thank you!').toUpperCase()}
        </Text>

        <Text
          style={{
            color: `${styles.colors.black}55`,
            fontSize: styles.fonSize.md,
            fontWeight: '500',
            width: '100%',
            textAlign: 'center',
          }}>
          {t('Subscription registration has been successfully completed.')}
        </Text>
        <Text
          style={{
            color: `${styles.colors.black}55`,
            fontSize: styles.fonSize.md,
            fontWeight: '500',
            width: '100%',
            textAlign: 'center',
            marginTop:40
          }}>
          {t('Now you can start your workout.')}
        </Text>

        <StandardButtonOutline
          title={t('Select a workout')}
          action={() => {
            // Сбрасываем навигационный стек и переходим на главный экран
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainStack' }],
            });
          }}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        borderRadius: 16,
        width: '100%',
        backgroundColor: styles.colors.background,
        padding: 16,
        gap: 30,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image source={require('../images/ok_hand.png')} />
      <Text
        style={{
          color: styles.colors.black,
          fontSize: styles.fonSize.g1,
          fontWeight: '1000',
          width: '100%',
          textAlign: 'center',
        }}>
        {t('Thank you!').toUpperCase()}
      </Text>
      <Text
          style={{
            color: `${styles.colors.black}77`,
            fontSize: styles.fonSize.md,
            fontWeight: '500',
            width: '100%',
            textAlign: 'center',
          }}>
          {t('Subscription registration has been failed.')}
        </Text>
      <StandardButtonOutline
        title={t('Try Again')}
        action={() => navigation.pop()}
      />
    </View>
  );
}
