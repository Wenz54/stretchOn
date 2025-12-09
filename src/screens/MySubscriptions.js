import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import styles from '../styles';
import SearchInputHeader from '../headers/SearchInputHeader';
import ScrollSelect from '../components/ScrollSelect';
import {useTranslation} from 'react-i18next';
import WorkoutCard from '../components/WorkoutCard';
import {useMeditationsList} from '../hooks/useMeditationsList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Text from '../components/Text';
import apiClient from '../services/api';
import StandardInput from '../components/StandardInput';
import StandardButton from '../components/StandardButton';
import config from '../config';
import moment from 'moment';
import StandardButtonOutline from '../components/StandardButtonOutline';
import CancelSubscription from '../Modals/CancelSubscription';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
const {width, height} = Dimensions.get('window');

export default function MySubscriptions({navigation}) {
  const {t} = useTranslation();

  const [showCancel, setShowCancel] = useState(false);
  const [promo, setPromo] = useState('');
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [directions, setDirections] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const Api = apiClient();

  const handlePay = () => {
    console.log();
    Api.post('/api/subscription/pay', {
      id_subscription: selectedSubscription.id,
      promo,
    })
      .then(response => {
        if (response.data.result.url) {
          navigation.push('WebPagePay', {url: response.data.result.url});
        } else {
          throw new Error('Internal server error');
        }
      })
      .catch(err => {
        throw new Error('Internal server error');
      });
  };

  const handleDelete = () => {
    console.log('🔴 handleDelete called!');
    console.log('🔴 Canceling subscription:', selectedSubscription.id);
    console.log('🔴 Sending POST to /api/subscription/cancel');
    
    Api.post('/api/subscription/cancel', {
      id_subscription: selectedSubscription.id,
    })
      .then(response => {
        console.log('✅ Cancel response:', response.data);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: t('The subscription has been successfully canceled.'),
          textBody: '',
        });
        Api.get('/api/subscription/my')
          .then(response => {

            if (response?.data?.result) {
              setSubscriptions(response.data.result);
            }
            setSelectedSubscription(false)
            setShowCancel(false)
           
          })
          .catch(error => {
            console.log(error.response);
            setSubscriptions([]);
          });
      })
      .catch(err => {
        throw new Error('Internal server error');
      });
  };

  const handleDeleteNow = () => {
    Api.post('/api/subscription/cancel-now', {
      id_subscription: selectedSubscription.id,
    })
      .then(response => {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: t('Subscription canceled immediately'),
          textBody: '',
        });
        Api.get('/api/subscription/my')
          .then(response => {
            if (response?.data?.result) {
              setSubscriptions(response.data.result);
            }
            setSelectedSubscription(false)
            setShowCancel(false)
          })
          .catch(error => {
            console.log(error.response);
            setSubscriptions([]);
          });
      })
      .catch(err => {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t('Error canceling subscription'),
          textBody: '',
        });
      });
  };

  useEffect(() => {
    Api.get('/api/direction/get-all')
      .then(response => {
        if (response?.data?.result?.directions) {
          setDirections(
            response?.data?.result?.directions.filter(i => i.id !== 1),
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    Api.get('/api/subscription/my')
      .then(response => {
        console.log('🔍 My subscriptions response:', JSON.stringify(response.data, null, 2));
        
        if (response?.data?.result) {
          console.log('✅ Setting subscriptions:', response.data.result);
          setSubscriptions(response.data.result);
        } else {
          console.log('❌ result is null or undefined');
        }
      })
      .catch(error => {
        console.log('❌ API Error:', error);
        console.log(error.response);
        setSubscriptions([]);
      });
  }, []);

  useEffect(() => {
    if (directions.length > 0) {
      setSelectedDirection(directions[0].id);
    } else {
      setSelectedDirection(null);
    }
  }, [directions]);

  if (selectedSubscription) {
    return (
      <View style={{flex: 1, backgroundColor: styles.colors.background}}>
        {showCancel && (
          <CancelSubscription
            hide={() => {
              setShowCancel(false);
            }}
            handleSubmit={() => {
              handleDelete()
            }}
          />
        )}
        <ScrollView
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: styles.colors.background,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            rowGap: 5,
            paddingTop: 4,
            paddingHorizontal: 4,
          }}>
          <View
            style={{
              borderRadius: 16,
              flex: 1,
              width: '100%',
              height: '100%',
              backgroundColor: styles.colors.background,
              padding: 16,
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
            <View
              style={{
                width: '100%',
                borderRadius: 16,
                gap: 7,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  color: '#222',
                  fontSize: styles.fonSize.g1,
                  fontWeight: '1000',
                  width: '100%',
                  textAlign: 'left',
                }}>
                {`${selectedSubscription.month}\n${t('month')}`.toUpperCase()}
              </Text>
              <Text
                style={{
                  color: '#777',
                  fontSize: styles.fonSize.lg,
                  fontWeight: '500',
                  width: '100%',
                  textAlign: 'left',
                }}>
                {selectedSubscription.directory?.length > 1
                  ? t('All directions')
                  : `${t('One direction')}: ${
                      directions.find(
                        d => d.id == selectedSubscription.directory[0].id,
                      ).name
                    }`}
              </Text>
              {selectedSubscription.is_canceled || selectedSubscription.ends_at ? (
                <View style={{
                  backgroundColor: '#FFF3E0',
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 8,
                  borderLeftWidth: 3,
                  borderLeftColor: '#FF9800',
                }}>
                  <Text
                    style={{
                      color: '#E65100',
                      fontSize: styles.fonSize.md,
                      fontWeight: '600',
                      width: '100%',
                      textAlign: 'left',
                    }}>
                    {`${t('Subscription canceled. Paid period until')}: ${moment(
                      selectedSubscription.ends_at,
                    ).format('DD.MM.YYYY')}`}
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    color: '#777',
                    fontSize: styles.fonSize.md,
                    fontWeight: '400',
                    width: '100%',
                    textAlign: 'left',
                  }}>
                  {`${t('Subscription is active until')} ${moment(
                    selectedSubscription.created_at,
                  ).add(selectedSubscription.month, 'months').format('DD.MM.YYYY')}`}
                </Text>
              )}
            </View>

            {!(selectedSubscription.is_canceled || selectedSubscription.ends_at) && (
              <>
                <StandardButton
                  title={t('Renew your subscription')}
                  action={handlePay}
                />
                <StandardButtonOutline
                  title={t('Cancel subscription')}
                  action={() => setShowCancel(true)}
                />
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: styles.colors.background}}>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#CCECEC',
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          rowGap: 5,
          paddingTop: 4,
          paddingHorizontal: 4,
        }}>
        <View
          style={{
            borderRadius: 16,
            width: '100%',
            backgroundColor: styles.colors.background,
            padding: 16,
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
              color: styles.colors.black,
              fontSize: styles.fonSize.h1,
              fontWeight: '1000',
              width: '100%',
              textAlign: 'left',
            }}>
            {t('Your\nsubscriptions').toUpperCase()}
          </Text>
        </View>

        {subscriptions.map((item, index) => (
          <Subscription
            key={index}
            subscription={item}
            isActive={selectedSubscription === item.id}
            setActive={() => setSelectedSubscription(item)}
            name={item.name.toUpperCase()}
            month={item.month}
            price={item.amount}
            directions={directions}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const Subscription = ({
  isActive,
  setActive,
  name,
  month,
  price,
  subscription,
  directions,
}) => {
  const {t} = useTranslation();
  console.log(subscription);
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        width: '100%',
        borderRadius: 16,
        backgroundColor: styles.colors.white,
      }}
      onPress={setActive}>
      <View
        style={{
          width: '100%',
          borderRadius: 16,
          padding: 20,
          gap: 7,
        }}>
        <Text
          style={{
            color: '#444',
            fontSize: styles.fonSize.lg,
            fontWeight: '500',
            width: '100%',
            textAlign: 'left',
          }}>
          {subscription.month} {t('month')}
        </Text>
        <Text
          style={{
            color: '#777',
            fontSize: styles.fonSize.lg,
            fontWeight: '500',
            width: '100%',
            textAlign: 'left',
          }}>
          {subscription.directory.length > 1
            ? t('All directions')
            : `${t('One direction')}: ${
                directions?.find(d => d.id == subscription.directory[0].id)?.name || ''
              }`}
        </Text>
        <Text
          style={{
            color: styles.colors.regular,
            fontSize: styles.fonSize.lg,
            fontWeight: '400',
            width: '100%',
            textAlign: 'left',
          }}>
          {`${price / 100} $`}
        </Text>
        {subscription.is_canceled || subscription.ends_at ? (
          <Text
            style={{
              color: '#FF6B00',
              fontSize: styles.fonSize.md,
              fontWeight: '600',
              width: '100%',
              textAlign: 'left',
            }}>
            {t('Canceled')}
          </Text>
        ) : (
          <Text
            style={{
              color: '#777',
              fontSize: styles.fonSize.md,
              fontWeight: '400',
              width: '100%',
              textAlign: 'left',
            }}>
            {`${t('Subscription is active until')} ${moment(
              subscription.created_at,
            ).add(subscription.month, 'months').format('DD.MM.YYYY')}`}
          </Text>
        )}
        <Text
          style={{
            marginTop: 20,
            color: styles.colors.primary,
            fontSize: styles.fonSize.lg,
            fontWeight: '600',
            width: '100%',
            textAlign: 'left',
          }}>
          {t('Change subscription')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
