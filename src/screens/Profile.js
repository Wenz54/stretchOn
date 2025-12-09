import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Text from '../components/Text';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../styles';
import ErrorsModal from '../Modals/ErrorsModal';
import {useProfile} from '../hooks/useProfile';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MenuItem from '../components/MenuItem';
import {useTranslation} from 'react-i18next';
import config from '../config';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import apiClient from '../services/api';
import LanguageModal from '../Modals/LanguageModal';
import LogoutModal from '../Modals/LogoutModal';
import AsyncStorage from '@react-native-community/async-storage';

export default function Profile({navigation}) {
  const {
    refreshing,
    errors,
    userData,
    handleRefresh,
    handleDeleteAccount,
    handleLogout,
    isFirstLoad,
  } = useProfile();
  console.log(userData)
  let last_workout = useSelector(state => state.auth).last_workout;
  const width = Dimensions.get('window').width - styles.paddingHorizontal * 2;
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [haveNotifications, setHaveNotifications] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const Api = apiClient();
  
  async function handleLoadNotificationsStatus() {
    return Api.post('/api/notification/get-count-notifications').then(
      ({data}) => {
        if (data?.result?.count > 0) {
          setHaveNotifications(true);
        } else {
          setHaveNotifications(false);
        }
        return [];
      },
    );
  }

  async function loadCurrentLanguage() {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
      } else if (userData?.localization) {
        setCurrentLanguage(userData.localization);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  }

  useEffect(() => {
    handleLoadNotificationsStatus();
    loadCurrentLanguage();
  }, [userData]);
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
    <LinearGradient
      start={{x: -0.4, y: 0.9}}
      end={{x: 2, y: 1}}
      colors={['#ffffff', styles.colors.primary]}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        style={{
          width: '100%',
          height: '100%',
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 15,
          paddingBottom: 20,
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 15,
            paddingTop: styles.paddingHorizontal,
            paddingHorizontal: styles.paddingHorizontal,
          }}>
          {userData?.avatar?.length > 0 ? (
            <Image
              source={{uri: config.baseUrl + userData?.avatar}}
              style={{width: width / 4, height: width / 4, borderRadius: width}}
            />
          ) : (
            <View
              style={{
                width: width / 4,
                height: width / 4,
                borderRadius: width,
                backgroundColor: styles.colors.highlight,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons
                name="person"
                style={{color: styles.colors.primary, fontSize: 50}}
              />
            </View>
          )}
          <View style={{flex: 1}}>
            <Text
              style={{
                color: styles.colors.black,
                fontSize: styles.fonSize.lg,
                fontWeight: '200',
              }}>
              Hey
            </Text>
            <Text
              style={{
                color: styles.colors.black,
                fontSize: styles.fonSize.lg,
                fontWeight: '500',
              }}>
              {userData?.name}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: '#000',
              borderRadius: 50,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              navigation.navigate('Notifications');
            }}>
            <MaterialCommunityIcons
              name={haveNotifications ? 'bell-badge-outline' : 'bell-outline'}
              size={styles.fonSize.h1}
              color={styles.colors.gray5}
            />
          </TouchableOpacity>
        </View>
        {last_workout && (
          <View
            style={{
              borderRadius: 16,
              width: '97%',
              backgroundColor: styles.colors.background,
              padding: 10,
              gap: 10,
              margin: 3,
            }}>
            <Text
              style={{
                color: styles.colors.black,
                fontSize: styles.fonSize.icon,
                fontWeight: '1000',
                width: '100%',
                textAlign: 'left',
              }}>
              {t('Last workout').toUpperCase()}
            </Text>

            <TouchableOpacity
              style={{width: '100%'}}
              onPress={() => {
                navigation.push('WorkoutDetailed', {workout: last_workout});
              }}>
              <Image
                source={{uri: config.baseUrl + last_workout.image}}
                style={{width: '100%', height: 200, borderRadius: 24}}
              />
              <Text
                style={{
                  color: styles.colors.black,
                  fontSize: styles.fonSize.lg,
                  fontWeight: '400',
                }}>
                {last_workout.name}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: styles.colors.regular,
                    fontSize: styles.fonSize.xs,
                    fontWeight: '400',
                  }}>
                  {last_workout.duration_time} {t('min.')} |{' '}
                  {last_workout.level}{' '}
                </Text>
                {renderDifficultyBars(last_workout.level)}
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            borderRadius: 16,
            width: '97%',
            backgroundColor: styles.colors.background,
            padding: 10,
            gap: 4,
            marginHorizontal: 3,
          }}>
          <MenuItem
            title={t('Edit profile')}
            onPress={() => navigation.navigate('PersonalData')}
          />
          <MenuItem
            title={t('Subscriptions')}
            onPress={() => navigation.navigate('MySubscriptions')}
          />
          <MenuItem
            title={t('Support')}
            onPress={() => navigation.navigate('Support')}
          />
          <MenuItem
            title={t('Community')}
            onPress={() => navigation.navigate('Contacts')}
          />
          <MenuItem
            title={t('Language settings') || 'Language settings'}
            onPress={() => setLanguageModalVisible(true)}
          />
          <MenuItem 
            title={t('Log out')} 
            onPress={() => setLogoutModalVisible(true)} 
            no_border 
          />

          <Text
            style={{
              color: styles.colors.regular,
              fontSize: styles.fonSize.md,
              fontWeight: '200',
              marginLeft: 10,
              marginTop: 40,
            }}>
            App Version: 0.9
          </Text>
        </View>
      </ScrollView>
      
      <LanguageModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        currentLanguage={currentLanguage}
      />
      
      {logoutModalVisible && (
        <LogoutModal
          hide={() => setLogoutModalVisible(false)}
          handleLogout={() => {
            setLogoutModalVisible(false);
            handleLogout();
          }}
        />
      )}
    </LinearGradient>
  );
}

const localStyles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  bar: {
    marginTop: 4,
    width: 5,
    height: 12,
    borderRadius: 2,
    borderColor: '#ccc',
    borderWidth: 0.5,
  },
  barFilled: {
    backgroundColor: '#ccc',
  },
  barEmpty: {
    backgroundColor: '#fff',
  },
});

const renderDifficultyBars = level => {
  let barsToFill = 0;
  switch (level) {
    case 'Beginner':
      barsToFill = 1;
      break;
    case 'Experienced':
      barsToFill = 3;
      break;
    case 'Professional':
      barsToFill = 5;
      break;
    default:
      barsToFill = 0;
  }

  return (
    <View style={localStyles.barContainer}>
      {[...Array(5)].map((_, i) => (
        <View
          key={i}
          style={[
            localStyles.bar,
            i < barsToFill ? localStyles.barFilled : localStyles.barEmpty,
          ]}
        />
      ))}
    </View>
  );
};
