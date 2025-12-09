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
const {width, height} = Dimensions.get('window');

export default function SubscriptionSelect({navigation}) {
  const [isSingle, setIsSingle] = useState(true);
  const [promo, setPromo] = useState('');
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [directions, setDirections] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const Api = apiClient();
  const {t} = useTranslation();
  const handlePay = () => {
    console.log();
    Api.post('/api/subscription/pay', {
      id_subscription: selectedSubscription,
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
    Api.get('/api/subscription/get-all')
      .then(response => {
        if (response?.data?.result?.subscription) {
          setSubscriptions(response?.data?.result?.subscription);
        }
      })
      .catch(error => {
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

  useEffect(() => {
    if (subscriptions.length > 0) {
      setSelectedSubscription(subscriptions[0].id);
    } else {
      setSelectedSubscription(null);
    }
  }, [subscriptions]);

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
              fontSize: styles.fonSize.g1,
              fontWeight: '1000',
              width: '100%',
              textAlign: 'left',
            }}>
            {t('We offer a personalized plan!').toUpperCase()}
          </Text>
          <View style={{width: '100%', flexDirection: 'row', gap: 30}}>
            <TouchableOpacity onPress={() => setIsSingle(true)}>
              <Text
                style={{
                  color: isSingle
                    ? styles.colors.primary
                    : styles.colors.regular,
                  fontSize: styles.fonSize.md,
                }}>
                {t('One direction')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSingle(false)}>
              <Text
                style={{
                  color: isSingle
                    ? styles.colors.regular
                    : styles.colors.primary,
                  fontSize: styles.fonSize.md,
                }}>
                {t('All directions')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {isSingle && (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              gap: 4,
              rowGap: 4,
              flexWrap: 'wrap',
            }}>
            {directions.map((item, index) => (
              <Direction
                key={index}
                image={item.image_home}
                isActive={selectedDirection === item.id}
                setActive={() => setSelectedDirection(item.id)}
                name={(item.name || '').toUpperCase()}
              />
            ))}
          </View>
        )}

        <View
          style={{
            borderRadius: 16,
            width: '100%',
            backgroundColor: styles.colors.background,
            padding: 10,
            gap: 10,
            marginBottom: 20,
          }}>
          {subscriptions
            .filter(item =>
              isSingle && selectedDirection
                ? item.directory.some(
                    directory => directory.id == selectedDirection,
                  ) && item.directory.length == 1
                : item.directory.length > 1,
            )
            .map((item, index) => (
              <Subscription
                key={index}
                isActive={selectedSubscription === item.id}
                setActive={() => setSelectedSubscription(item.id)}
                name={(item.name || '').toUpperCase()}
                month={item.month}
                price={item.amount}
              />
            ))}
          {subscriptions.length > 0 && (
            <>
              <Text
                style={{
                  color: styles.colors.black,
                  fontSize: styles.fonSize.h1,
                  fontWeight: '1000',
                  width: '100%',
                  textAlign: 'left',
                }}>
                {t('DO YOU HAVE A PROMO CODE?').toUpperCase()}
              </Text>
              <Text
                style={{
                  color: styles.colors.regular,
                  fontSize: styles.fonSize.md,
                }}>
                {t('Please provide a promo code if you have one')}
              </Text>
              <StandardInput
                placeholder={t('Promo code')}
                value={promo}
                onChange={setPromo}
              />
            </>
          )}
          {subscriptions.length === 0 && (
            <>
              <Text
                style={{
                  color: styles.colors.black,
                  fontSize: styles.fonSize.h1,
                  fontWeight: '1000',
                  width: '100%',
                  textAlign: 'left',
                }}>
                {t('SUBSCRIPTIONS NOT FOUND').toUpperCase()}
              </Text>
            </>
          )}
          <StandardButton
            disabled={!selectedSubscription}
            title={t("Pay for subscription")}
            action={handlePay}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const Direction = ({image, isActive, setActive, name}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        width: '48.5%',
        height: 118,
        borderRadius: 16,
      }}
      onPress={setActive}>
      <Image
        source={{uri: config.baseUrl + image}}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 16,
          borderWidth: isActive ? 2 : 0,
          borderColor: styles.colors.primary,
          backgroundColor: styles.colors.background,
        }}
      />
      <Text
        style={{
          position: 'absolute',
          bottom: 15,
          left: 5,
          color: styles.colors.black,
          fontSize: styles.fonSize.md,
          fontWeight: '1000',
          width: '100%',
          textAlign: 'left',
        }}>
        {name}
      </Text>
      {isActive && (
        <View
          style={{
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 10,
            right: 10,
            borderRadius: 20,
            backgroundColor: styles.colors.primary,
          }}>
          <Ionicons name="checkmark" size={14} color={styles.colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const Subscription = ({isActive, setActive, name, month, price}) => {
  const {t} = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        width: '100%',
        borderRadius: 16,
      }}
      onPress={setActive}>
      <View
        style={{
          width: '100%',
          borderRadius: 16,
          borderWidth: 2,
          borderColor: isActive ? styles.colors.primary : 'transparent',
          backgroundColor: isActive ? '#CCECEC' : '#ECF4F4',
          padding: 10,
        }}>
        {isActive && (
          <View
            style={{
              width: 25,
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 10,
              right: 10,
              borderRadius: 20,
              backgroundColor: styles.colors.primary,
            }}>
            <Ionicons name="checkmark" size={18} color={styles.colors.white} />
          </View>
        )}
        <Text
          style={{
            color: styles.colors.black,
            fontSize: 34,
            fontWeight: '1000',
            width: '100%',
            textAlign: 'left',
          }}>
          {name.split(' ').length > 1 
            ? name.split(' ')[0] + '\n' + name.split(' ').slice(1).join(' ')
            : name}
        </Text>
        <Text
          style={{
            color: styles.colors.primary,
            fontSize: styles.fonSize.lg,
            fontWeight: '600',
            width: '100%',
            textAlign: 'left',
          }}>
          {`${parseFloat(price / 100 / month / 4).toFixed(1)} $/${t('week')}`}
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
      </View>
    </TouchableOpacity>
  );
};
