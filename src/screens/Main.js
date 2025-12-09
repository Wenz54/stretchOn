import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
  Text as RNText,
  Modal,
} from 'react-native';
import styles from '../styles';
import {useMainContent} from '../hooks/useMainContent';
import MainHeader from '../headers/MainHeader';
import ErrorsModal from '../Modals/ErrorsModal';
import DirectionCard from '../components/DirectionCard';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../components/Text';
import {useTranslation} from 'react-i18next';
import apiClient from '../services/api';
import config from '../config';
import VideoPlayerModal from '../Modals/VideoPlayerModal'; // Импортируем VideoPlayerModal
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {useSelector} from 'react-redux';
import {filterByLanguage, getDirectionName, getDirectionDescription} from '../services/utils';
import WideStretchLetter from '../components/WideStretchLetter';

export default function Main({navigation}) {
  const isFocused = useIsFocused();
  const {t, i18n} = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const Api = apiClient();
  
  // Маппинг букв на их широкие Unicode коды
  const wideLetterMap = {
    'W': '\uF00A', 'A': '\uF01C', 'B': '\uF01F', 'C': '\uF023',
    'D': '\uF026', 'E': '\uF029', 'F': '\uF02C', 'G': '\uF02E',
    'H': '\uF031', 'J': '\uF034', 'K': '\uF037', 'L': '\uF03A',
    'M': '\uF03D', 'N': '\uF040', 'O': '\uF043', 'P': '\uF046',
    'Q': '\uF049', 'R': '\uF04C', 'S': '\uF04F', 'T': '\uF052',
    'U': '\uF055', 'Z': '\uF05A'
  };
  
  // Функция для получения широкой версии последней буквы
  const getWideLastLetter = (text) => {
    if (!text) return { rest: '', lastLetter: '' };
    const upperText = text.toUpperCase();
    const lastChar = upperText[upperText.length - 1];
    const rest = upperText.slice(0, -1);
    const wideLetter = wideLetterMap[lastChar] || lastChar;
    return { rest, lastLetter: wideLetter, isWide: !!wideLetterMap[lastChar] };
  };
  const changeLanguage = async lng => {
    try {
      await i18n.changeLanguage(lng); // Меняем язык
      await AsyncStorage.setItem('language', lng); // Сохраняем язык
      console.log(`Язык изменен на ${lng}`);
    } catch (error) {
      console.error('Ошибка при смене языка:', error);
    }
  };
  const {refreshing, errors, haveNotifications, handleRefresh, isFirstLoad} =
    useMainContent();

  const [directions, setDirections] = useState([]);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false); // Состояние для отображения видеоплеера
  const userData = useSelector(state => state.auth).userData;
  useEffect(() => {
    //changeLanguage('en');
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
  }, [isFocused, i18n.language]);

  useEffect(() => {
    AsyncStorage.getItem('language')
      .then(lang => {
        changeLanguage(userData?.localization || lang || 'en-US');
        if (!userData?.localization) {
          Api.post('/api/user/settings-update', {
            localization: lang || 'en-US',
          });
        }
      })
      .catch(err => {
        changeLanguage(userData?.localization || 'en-US');
        if (!userData?.localization) {
          Api.post('/api/user/settings-update', {
            localization: 'en-US',
          });
        }
      });
  }, [userData?.localization]);

  const handleWelcomePress = () => {
    // Показываем приветственное видео (локальный файл sample-5s.mp4)
    setIsPlayerVisible(true);
  };

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
      start={{x: -1, y: 0.7}}
      end={{x: 2, y: 1}}
      colors={['#ffffff', styles.colors.highlight]}
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
          alignItems: 'center',
          rowGap: 3,
          paddingTop: 4,
          paddingBottom: 90 + styles.paddingHorizontal * 2,
        }}>
        {/* Блок приветствия */}
        <TouchableOpacity>
          <View
            style={{
              borderRadius: 16,
              width: '97%',
              backgroundColor: styles.colors.background,
              padding: 10,
              paddingLeft: 16,
              gap: isEnglish ? 5 : 10,
            }}>
            <Text
              style={{
                color: styles.colors.black,
                fontSize: 34,
                fontWeight: '1000',
                width: '60%',
                textAlign: 'left',
                marginBottom: 0,
              }}>
              {t('Hi i`m Hanna').toUpperCase()}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                gap: 5,
              }}>
              <Text
                style={{
                  color: styles.colors.regular,
                  fontSize: styles.fonSize.md,
                  fontWeight: '300',
                  width: 180,
                  textAlign: 'left',
                }}>
                {t('Achieve new results in sports, thanks to innovative stretching in the application.')} {t('Achieve new results in sports, thanks to innovative stretching in the application.')}
              </Text>
              <TouchableOpacity
                style={{width: 175, height: 239}}
                onPress={handleWelcomePress}>
                <Image
                  style={{resizeMode: 'contain', width: 175, height: 239}}
                  source={require('../images/hanna.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* Остальной код */}
        <View style={{width: '97%', marginTop: 12, marginBottom: 10}}>
          <Text
            style={{
              color: styles.colors.black,
              fontSize: 34,
              fontWeight: '1000',
              textAlign: 'left',
              lineHeight: 36,
            }}>
            {t('WHAT MAKES OUR').toUpperCase()}
          </Text>
          <Text
            style={{
              color: styles.colors.black,
              fontSize: 34,
              fontWeight: '1000',
              textAlign: 'left',
              lineHeight: 36,
            }}>
            {t('WORKOUTS UNIQUE LINE 2').toUpperCase()}
          </Text>
        </View>
        <ScrollView style={{width: '97%'}} horizontal>
          <View
            style={{
              backgroundColor: styles.colors.white,
              borderRadius: 16,
              width: 330,
              padding: 10,
              paddingVertical: 30,
              gap: 10,
              marginRight: 3,
            }}>
            <Image
              source={require('../images/diagram.png')}
              style={{width: 50, height: 50}}
            />
            <Text
              style={{
                color: styles.colors.black,
                fontSize: styles.fonSize.xl,
                fontWeight: '1000',
                textAlign: 'left',
              }}>
              {t('Specialization by sports').toUpperCase()}
            </Text>
            <Text
              style={{
                color: styles.colors.primary,
                fontSize: styles.fonSize.smd,
                fontWeight: '1000',
                textAlign: 'left',
              }}>
              {t('Adaptation to various disciplines')}
            </Text>
            <Text
              style={{
                color: styles.colors.regular,
                fontSize: styles.fonSize.smd,
                fontWeight: '300',
                textAlign: 'left',
              }}>
              {t(
                'Each program is carefully tailored to the specifics of tennis and long-haul travel, ensuring that training is suitable for both professionals and amateurs.',
              )}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: styles.colors.white,
              borderRadius: 16,
              width: 330,
              padding: 10,
              paddingVertical: 30,
              gap: 10,
              marginRight: 3,
            }}>
            <Image
              source={require('../images/music.png')}
              style={{width: 50, height: 50}}
            />
            <Text
              style={{
                color: styles.colors.black,
                fontSize: styles.fonSize.xl,
                fontWeight: '1000',
                textAlign: 'left',
              }}>
              {t('Exclusive music sets').toUpperCase()}
            </Text>
            <Text
              style={{
                color: styles.colors.primary,
                fontSize: styles.fonSize.smd,
                fontWeight: '1000',
                textAlign: 'left',
              }}>
              {t('Motivation through music')}
            </Text>
            <Text
              style={{
                color: styles.colors.regular,
                fontSize: styles.fonSize.smd,
                fontWeight: '300',
                textAlign: 'left',
              }}>
              {t(
                'Each lesson is accompanied by specially created music sets from famous DJs, which creates a unique atmosphere for training.',
              )}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: styles.colors.white,
              borderRadius: 16,
              width: 330,
              padding: 10,
              paddingVertical: 30,
              gap: 10,
              marginRight: 3,
            }}>
            <Image
              source={require('../images/music.png')}
              style={{width: 50, height: 50}}
            />
            <Text
              style={{
                color: styles.colors.black,
                fontSize: styles.fonSize.xl,
                fontWeight: '1000',
                textAlign: 'left',
              }}>
              {t('Accessibility on mobile devices').toUpperCase()}
            </Text>
            <Text
              style={{
                color: styles.colors.primary,
                fontSize: styles.fonSize.smd,
                fontWeight: '1000',
                textAlign: 'left',
              }}>
              {t('Motivation through music')}
            </Text>
            <Text
              style={{
                color: styles.colors.regular,
                fontSize: styles.fonSize.smd,
                fontWeight: '300',
                textAlign: 'left',
              }}>
              {t(
                'Each lesson is accompanied by specially created music sets from famous DJs, which creates a unique atmosphere for training.',
              )}
            </Text>
          </View>
        </ScrollView>

        <View
          style={{
            borderRadius: 16,
            width: '97%',
            backgroundColor: styles.colors.background,
            padding: 10,
            gap: 10,
            marginTop: 20,
          }}>
          <Text
            style={{
              color: styles.colors.black,
              fontSize: 34,
              fontWeight: '1000',
              width: '100%',
              textAlign: 'left',
              marginTop: 10,
              marginBottom: 5,
            }}>
            {t('Find what moves you').toUpperCase()}
          </Text>
          {directions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{marginBottom: 12}}
              onPress={() =>
                navigation.navigate(t('Workouts'), {
                  screen: 'WorkoutsList',
                  params: {direction: item, fromHome: true},
                })
              }>
              <Image
                source={{uri: config.baseUrl + item.image_home}}
                style={{
                  width: '100%',
                  height: 189,
                  borderRadius: 16,
                  backgroundColor: styles.colors.background,
                  resizeMode: 'cover',
                }}
              />
              <View style={{position: 'absolute', top: 20, left: 15, width: '90%'}}>
                <Text
                  style={{
                    color: styles.colors.black,
                    fontSize: styles.fonSize.h2,
                    fontWeight: '1000',
                    textAlign: 'left',
                  }}>
                  STRETC<RNText style={{fontFamily: 'StretchProRegular', fontSize: styles.fonSize.h2, color: styles.colors.black}}>{'\uF031'}</RNText>
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap'}}>
                  <Text style={{color: styles.colors.black, fontSize: styles.fonSize.h2, fontWeight: '1000'}}>O</Text>
                  <RNText style={{fontFamily: 'StretchProRegular', fontSize: styles.fonSize.h2, color: styles.colors.black}}>{'\uF040'}</RNText>
                  {(() => {
                    const directionName = getDirectionName(item, i18n.language);
                    const { rest, lastLetter, isWide } = getWideLastLetter(directionName);
                    return (
                      <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 5, flex: 1}}>
                        <Text
                          style={{
                            color: styles.colors.primary,
                            fontSize: styles.fonSize.h2,
                            fontWeight: '1000',
                          }}>
                          {rest}
                        </Text>
                        {isWide ? (
                          <RNText style={{fontFamily: 'StretchProRegular', fontSize: styles.fonSize.h2, color: styles.colors.primary}}>
                            {lastLetter}
                          </RNText>
                        ) : (
                          <Text style={{color: styles.colors.primary, fontSize: styles.fonSize.h2, fontWeight: '1000'}}>
                            {lastLetter}
                          </Text>
                        )}
                      </View>
                    );
                  })()}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Видеоплеер в модальном окне поверх ВСЕГО (включая таб бар) */}
      <Modal
        visible={isPlayerVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setIsPlayerVisible(false)}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <VideoPlayerModal
            isVisible={true}
            hide={() => setIsPlayerVisible(false)}
            startInPlayState={true}
            startInFullscreen={true}
            initialTime={0}
            updateTime={() => {}}
            containerStyle={{
              width: '100%',
              height: '100%',
            }}
            fullscreenStyle={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}
            showVideo={true}
            setShowVideo={() => {}}
            videos={[
              {
                uri: require('../../assets/sample-5s.mp4'),
                name: 'Welcome',
              },
            ]}
            showClose
            hideResize
          />
        </View>
      </Modal>
    </LinearGradient>
  );
}
