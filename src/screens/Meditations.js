import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import Text from '../components/Text';
import apiClient from '../services/api';
import config from '../config';
import PayRequest from '../Modals/PayRequest';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {filterByLanguage} from '../services/utils';

export default function Meditations({navigation, route}) {
  const direction_id = route?.params?.direction?.id;
  const userData = useSelector(state => state.auth).userData;
  const isFocused = useIsFocused();

  const [direction, setDirection] = useState(null);
  const [minddex, setMIndex] = useState(null);
  const [activeMeditation, setActiveMeditation] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPay, setShowPay] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  const {t, i18n} = useTranslation();
  const Api = apiClient();

  // Загрузка направления
  useEffect(() => {
    Api.get('/api/direction/get', {params: {id: direction_id}})
      .then(response => {
        if (response?.data?.result) {
          setDirection(response?.data?.result);
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  }, [direction_id]);

  // Загрузка медитаций и подписок
  useEffect(() => {
    fetchWorkouts();
    fetchSubscriptions();
  }, [direction_id, isFocused]); // Перезагружаем при фокусе на экран

  const fetchWorkouts = async () => {
    try {
      const response = await Api.get('/api/training/get-all', {
        params: {direction_id, type: 'meditation'},
      });
      if (response?.data?.result?.trainings) {
        const allMeditations = response.data.result.trainings;
        // Фильтруем медитации по языку пользователя
        const filteredMeditations = filterByLanguage(allMeditations, i18n.language);
        // Сортируем по ID: старые сверху (ASC), новые снизу
        const sortedMeditations = filteredMeditations.sort((a, b) => a.id - b.id);
        console.log(`Meditations: Filtered ${allMeditations.length} to ${filteredMeditations.length} for lang ${i18n.language}, sorted by ID ASC`);
        setWorkouts(sortedMeditations);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      console.log('📡 [Meditations] Fetching user subscriptions...');
      const response = await Api.get('/api/subscription/my');
      console.log('📥 [Meditations] Subscription response:', response?.data);
      if (response?.data?.result) {
        setSubscriptions(response.data.result);
        console.log('✅ [Meditations] Active subscriptions loaded:', response.data.result);
        console.log('📊 [Meditations] Number of subscriptions:', response.data.result.length);
      } else {
        console.log('⚠️ [Meditations] No subscriptions in response');
        setSubscriptions([]);
      }
    } catch (error) {
      console.log('❌ [Meditations] Error fetching subscriptions:', error);
      console.log('❌ [Meditations] Error response:', error.response?.data);
      setSubscriptions([]);
    }
  };

  // Воспроизведение аудио
  const playAudio = meditation => {
    let audioUrl =
      config.baseUrl + `/api/video/get?id=${meditation.id}&quality=audio`;
    if (sound) {
      sound.release();
    }

    const newSound = new Sound(audioUrl, null, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      setDuration(newSound.getDuration());
      newSound.play(success => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
        setIsPlaying(false);
      });
      setIsPlaying(true);
    });

    setSound(newSound);

    // Обновление текущего времени
    const interval = setInterval(() => {
      newSound.getCurrentTime(seconds => {
        setCurrentTime(seconds);
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  // Управление воспроизведением
  const pauseAudio = () => {
    if (sound) {
      sound.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (sound) {
      sound.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (sound) {
      sound.stop();
      setIsPlaying(false);
    }
  };

  // Переключение медитаций
  const playNextMeditation = () => {
    if (minddex < workouts.length - 1) {
      const nextMeditation = workouts[minddex + 1];
      setActiveMeditation(nextMeditation);
      setMIndex(minddex + 1);
      stopAudio();
      playAudio(nextMeditation);
    }
  };

  const playPreviousMeditation = () => {
    if (minddex > 0) {
      const previousMeditation = workouts[minddex - 1];
      setActiveMeditation(previousMeditation);
      setMIndex(minddex - 1);
      stopAudio();
      playAudio(previousMeditation);
    }
  };

  // Очистка звука при размонтировании
  useEffect(() => {
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, [sound]);

  // Проверка доступа к конкретной медитации
  const hasAccessToMeditation = (item, index) => {
    console.log('🔍 [Meditation] Checking access for:', item.name);
    console.log('📦 [Meditation] item.available from backend:', item.available);
    
    // Медитации ВСЕГДА платные - используем item.available от бэкенда
    // Бэкенд уже проверил подписку и вернул правильный статус
    console.log('🔐 [Meditation] Using backend decision - item.available:', item.available);
    return item.available === true;
  };

  // Обработчик выбора медитации
  const handleMeditationSelect = (item, index) => {
    // Проверяем доступ перед воспроизведением
    if (!hasAccessToMeditation(item, index)) {
      setShowPay(true);
      return;
    }
    
    setActiveMeditation(item);
    setMIndex(index);
    stopAudio();
    playAudio(item);
  };

  if (activeMeditation) {
    return (
      <LinearGradient
        start={{x: -1.0, y: 0.9}}
        end={{x: 4, y: 1}}
        colors={['#ffffff', styles.colors.primary]}
        style={{flex: 1, width: '100%', height: '100%'}}>
        <ImageBackground
          source={require('../images/back.png')}
          style={{
            flex: 1,
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          resizeMode="cover">
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 9,
              backgroundColor: '#000',
              borderRadius: 50,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setActiveMeditation(null);
              setMIndex(null);
              stopAudio();
            }}>
            <Ionicons
              name="chevron-back-outline"
              size={styles.fonSize.h1}
              color={styles.colors.gray5}
            />
          </TouchableOpacity>
          <View
            style={{
              marginTop: 100,
              gap: 10,
              alignItems: 'center',
              width: '90%',
            }}>
            <Image
              source={{uri: config.baseUrl + activeMeditation.image}}
              style={{width: 300, height: 300, borderRadius: 16}}
            />
            <Text
              style={{
                color: styles.colors.black,
                fontSize: styles.fonSize.h1,
                fontWeight: '500',
              }}>
              {activeMeditation.name}
            </Text>
            <Text
              style={{
                color: styles.colors.regular,
                fontSize: styles.fonSize.xl,
                fontWeight: '300',
              }}>
              {activeMeditation.description}
            </Text>
          </View>
          <View>
            <Slider
              style={{
                width: Dimensions.get('window').width * 0.9,
                transform: [{scaleY: 1.5}],
              }}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              minimumTrackTintColor={styles.colors.white}
              maximumTrackTintColor={'#ffffff'}
              thumbTintColor={styles.colors.white}
              onSlidingComplete={value => {
                if (sound) {
                  sound.setCurrentTime(value);
                }
              }}
            />
            <View
              style={{
                paddingHorizontal: 15,
                width: Dimensions.get('window').width * 0.9,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                marginVertical: 10,
              }}>
              <TouchableOpacity
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 40,
                  backgroundColor: '#FFFFFF22',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={playPreviousMeditation}>
                <Ionicons
                  name={'play-skip-back'}
                  size={styles.fonSize.h2}
                  color={styles.colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 40,
                  borderRadius: 16,
                  backgroundColor: '#FFFFFF22',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                }}
                onPress={isPlaying ? pauseAudio : resumeAudio}>
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={styles.fonSize.h2}
                  color={styles.colors.white}
                />
                <Text
                  style={{
                    color: styles.colors.white,
                    fontSize: styles.fonSize.md,
                    fontWeight: '500',
                  }}>
                  {isPlaying ? 'Pause' : 'Play'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 40,
                  backgroundColor: '#FFFFFF22',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={playNextMeditation}>
                <Ionicons
                  name={'play-skip-forward'}
                  size={styles.fonSize.h2}
                  color={styles.colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      start={{x: -0.4, y: 0.9}}
      end={{x: 4, y: 1}}
      colors={['#ffffff', styles.colors.primary]}
      style={{flex: 1, width: '100%', height: '100%'}}>
      {showPay && (
        <PayRequest navigation={navigation} hide={() => setShowPay(false)} />
      )}
      <ImageBackground
        source={require('../images/meditaation_background.png')}
        style={{
          flex: 1,
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
        }}
        resizeMode="contain">
        <ScrollView
          style={{width: '100%', height: '100%', flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            rowGap: 5,
            paddingHorizontal: 4,
            flexWrap: 'wrap',
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 9,
              backgroundColor: '#000',
              borderRadius: 50,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              if (route?.params?.fromHome) {
                navigation.navigate(t('Home'));
              } else {
                navigation.navigate('DirectionsMed');
              }
            }}>
            <Ionicons
              name="chevron-back-outline"
              size={styles.fonSize.h1}
              color={styles.colors.gray5}
            />
          </TouchableOpacity>

          <View
            style={{
              marginTop: 100,
              borderRadius: 16,
              width: '100%',
              padding: 10,
              gap: 10,
            }}>
            <Text
              style={{
                color: styles.colors.black,
                fontSize: styles.fonSize.icon,
                fontWeight: '1000',
                width: '100%',
                textAlign: 'left',
              }}>
              {t('Meditations').toUpperCase()}
            </Text>
            <Text
              style={{
                color: '#202020BD',
                fontSize: styles.fonSize.smd,
                fontWeight: '300',
                textAlign: 'left',
              }}>
              {t('Developed by sports psychologists specifically for this sport.')}
            </Text>
          </View>
          <View
            style={{
              borderRadius: 16,
              width: '100%',
              padding: 10,
              gap: 10,
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: styles.colors.black,
                  fontSize: styles.fonSize.xl,
                  fontWeight: '1000',
                  textAlign: 'left',
                }}>
                {t('Find a meditation that suits your mood').toUpperCase()}
              </Text>
            </View>
            <View
              style={{
                marginTop: 20,
                justifyContent: 'space-between',
                gap: 5,
              }}>
              {workouts.length > 0 &&
                workouts.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleMeditationSelect(item, index)}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 20,
                      borderColor: '#ffffff99',
                      borderBottomWidth: 2,
                      gap: 10,
                      position: 'relative',
                    }}>
                    <Image
                      source={{uri: config.baseUrl + item.image}}
                      style={{width: 65, height: 65, borderRadius: 10}}
                    />

                    <View style={{justifyContent: 'space-between', flex: 1}}>
                      <Text
                        style={{
                          color: styles.colors.regular,
                          fontSize: styles.fonSize.md,
                          fontWeight: '500',
                        }}>
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          color: '#202020',
                          fontSize: styles.fonSize.sm,
                          fontWeight: '300',
                        }}>
                        {item.description}
                      </Text>
                      <Text
                        style={{
                          color: styles.colors.regular,
                          fontSize: styles.fonSize.sm,
                          fontWeight: '300',
                        }}>
                        {item.duration_time || item.duration} {t('min.')}
                      </Text>
                    </View>
                    <View
                      style={{
                        zIndex: 1,
                        width: 48,
                        height: 48,
                        alignSelf: 'center',
                        borderRadius: 100,
                        backgroundColor: hasAccessToMeditation(item, index)
                          ? styles.colors.primary
                          : styles.colors.gray,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Ionicons
                        name={hasAccessToMeditation(item, index) ? 'play' : 'lock-closed'}
                        size={styles.fonSize.h2}
                        color={styles.colors.white}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              {workouts.length == 0 && (
                <View
                  style={{
                    backgroundColor: styles.colors.gray5,
                    padding: 10,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 15,
                    borderRadius: 16,
                    alignItems: 'center',
                  }}>
                  <Ionicons
                    name="search"
                    size={30}
                    color={styles.colors.primary}
                  />
                  <Text
                    style={{
                      flex: 1,
                      color: styles.colors.regular,
                      fontSize: styles.fonSize.lg,
                      fontWeight: '4000',
                      textAlign: 'left',
                    }}>
                    {t('Nothing found.')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </LinearGradient>
  );
}
