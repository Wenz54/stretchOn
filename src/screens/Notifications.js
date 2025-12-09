import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Text from '../components/Text';
import styles from '../styles';
import ErrorsModal from '../Modals/ErrorsModal';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StandardButton from '../components/StandardButton'; // Предположим, что это ваш компонент кнопки
import apiClient from '../services/api';

export default function Notifications({navigation}) {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const width = Dimensions.get('window').width - styles.paddingHorizontal * 2;
  const Api = apiClient();
  
  // Локализация текста уведомления
  const localizeNotificationText = (text) => {
    // Убираем ВСЕ смайлики/эмодзи
    let cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    
    // Проверяем формат SUBSCRIPTION_CANCELED|название|дата
    if (cleanText.startsWith('SUBSCRIPTION_CANCELED|')) {
      const parts = cleanText.split('|');
      if (parts.length === 3) {
        const subscriptionName = parts[1];
        const endDate = parts[2];
        return `${t('Subscription canceled')}: ${subscriptionName}. ${t('Your subscription will be active until')} ${endDate}`;
      }
    }
    
    // Локализация webhook уведомлений от Stripe
    if (cleanText.includes('Your subscription has been activated') || cleanText.includes('subscription has been activated')) {
      return t('Your subscription has been activated');
    }
    if (cleanText.includes('Your subscription renewed') || cleanText.includes('subscription renewed')) {
      return t('Subscription renewed');
    }
    if (cleanText.includes('Your subscription has ended') || cleanText.includes('subscription has ended')) {
      return t('Subscription canceled');
    }
    if (cleanText.includes('Payment successful')) {
      return t('Your subscription has been activated');
    }
    
    // Для старых уведомлений
    if (cleanText.includes('successfully subscribed') || cleanText.includes('успешно оформили подписку') || cleanText.includes('успішно оформили підписку')) {
      return t('Your subscription has been activated');
    }
    if (cleanText.includes('renewed') || cleanText.includes('продлена') || cleanText.includes('продовжено')) {
      return t('Subscription renewed');
    }
    if (cleanText.includes('activated') || cleanText.includes('активирована') || cleanText.includes('активовано')) {
      return t('Your subscription has been activated');
    }
    if (cleanText.includes('canceled') || cleanText.includes('отменена') || cleanText.includes('скасовано')) {
      return t('Subscription canceled');
    }
    
    return cleanText;
  };
  
  // Загрузка уведомлений
  const fetchNotifications = async () => {
    try {
      const response = await Api.get('api/notification/get-notifications');
      if (response.data.success) {
        if (response.data.result.notifications.length === 0) {
          setNotifications([]);
        } else {
          // Сортируем уведомления: новые сверху, старые снизу
          const sortedNotifications = response.data.result.notifications.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          });
          setNotifications(sortedNotifications);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsFirstLoad(false);
      setRefreshing(false);
    }
  };

  // Обновление списка уведомлений
  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Отметить уведомление как прочитанное
  const markNotificationAsRead = async id => {
    try {
      await Api.post('api/notification/read-notifications', {ids: [id]});
      // Сразу удаляем уведомление из локального списка
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Отметить все уведомления как прочитанные
  const markAllNotificationsAsRead = async () => {
    const ids = notifications.map(notification => notification.id);
    try {
      await Api.post('api/notification/read-notifications', {ids});
      // Сразу очищаем весь список
      setNotifications([]);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Первая загрузка
  useEffect(() => {
    fetchNotifications();
  }, []);

  if (isFirstLoad) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: styles.colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={styles.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: styles.colors.grayLight}}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: styles.colors.grayLight,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingVertical: 10,
          gap: 2,
        }}>
        <View
          style={{
            borderRadius: 16,
            backgroundColor: styles.colors.background,
            padding: 10,
            gap: 10,
          }}>
          <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              gap: 10,
            }}>
            <TouchableOpacity
              style={{
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
            <Text
              style={{
                fontSize: 30,
                fontWeight: '1000',
                color: styles.colors.black,
              }}>
              {t('Notification').toUpperCase()}
            </Text>
            <TouchableOpacity onPress={markAllNotificationsAsRead}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '400',
                  color: styles.colors.primary,
                }}>
                {t('Mark all as read')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {notifications.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection:'row',
              justifyContent:'space-between',
              borderRadius: 16,
              backgroundColor: styles.colors.background,
              padding: 10,
              gap: 10,
            }}>
            <View style={{gap:5, flex: 1}}>
              <Text style={{fontSize: 16, color:styles.colors.black}}>
                {localizeNotificationText(item.data)}
              </Text>
              <Text style={{fontSize: 12, color: styles.colors.regular}}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => markNotificationAsRead(item.id)}
              style={{
                width: 36,
                height: 36,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="checkmark"
                size={28}
                color={styles.colors.primary}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
