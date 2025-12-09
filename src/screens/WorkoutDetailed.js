import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import styles from '../styles';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../components/Text';
import StandardButton from '../components/StandardButton';
import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useWorkoutDetails} from '../hooks/useWorkoutDetails';
import VideoPlayerModal from '../Modals/VideoPlayerModal';
import config from '../config';
import {useDispatch} from 'react-redux';
import apiClient from '../services/api';
import CommentInput from '../footers/CommentInput';
import {last_workout} from '../actions/auth';
import {filterByLanguage} from '../services/utils';
const {width, height} = Dimensions.get('window');
export default function WorkoutDetailed({navigation, route}) {
  const dispatch = useDispatch();
  const w = route?.params?.workout;
  const [play, setPlay] = useState(false);
  const [time, setTime] = useState(route?.params?.time || 0);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const {t, i18n} = useTranslation();
  const [step, setStep] = useState(0);
  const [workout, setWorkout] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const Api = apiClient();
  const [showVideo, setShowVideo] = useState(false); // Новое состояние для управления отображением видео
  const [videos, setVideos] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false); // Состояние для отслеживания fullscreen режима
  useEffect(() => {
    setPlay(false)
    setShowVideo(false)
    setIsPlayerVisible(false)
    setIsFullscreen(false)
    Api.get('/api/training/get', {params: {id: w.id}})
      .then(response => {
        if (response?.data?.result) {
          setWorkout(response?.data?.result);
        }
      })
      .catch(error => {
        console.log(error.response);
        setWorkout(w);
      });
    Api.get('/api/training/comments', {params: {training_id: w.id}})
      .then(response => {
        if (response?.data?.result?.comments) {
          setComments(response?.data?.result?.comments);
        }
      })
      .catch(error => {
        console.log(error.response);
      });
    Api.get('/api/training/get-all', {
      params: {direction_id: w.direction_id, type: 'training'},
    }).then(response => {
      if (response?.data?.result?.trainings) {
        const allTrainings = response.data.result.trainings;
        // Фильтруем тренировки по языку пользователя
        const filteredTrainings = filterByLanguage(allTrainings, i18n.language);
        console.log(`WorkoutDetailed (similar): Filtered ${allTrainings.length} to ${filteredTrainings.length} for lang ${i18n.language}`);
        setAllWorkouts(
          filteredTrainings.filter((i) => i.available || i.free)
        );
      }
    });
  }, [w]);



  const onNext = () => {
    const currentIndex = allWorkouts.findIndex((item) => item.id === workout.id);
    if (currentIndex < allWorkouts.length - 1) {
      const nextWorkout = allWorkouts[currentIndex + 1];
      navigation.navigate('WorkoutDetailed', {workout: {...nextWorkout,direction_id:w.direction_id}});
    }
  };

  const onPrev = () => {
    const currentIndex = allWorkouts.findIndex((item) => item.id === workout.id);
    if (currentIndex > 0) {
      const prevWorkout = allWorkouts[currentIndex - 1];
      navigation.navigate('WorkoutDetailed', {workout: {...prevWorkout,direction_id:w.direction_id}});
    }
  }
  useEffect(() => {
    if (workout) {
      let vids = [];

      if (workout.url_480) {
        vids.push({
          uri:
            config.baseUrl + `/api/video/get?id=${workout.id}&quality=url_480`,
          name: '480p',
        });
      }
      if (workout.url_1080) {
        vids.push({
          uri:
            config.baseUrl + `/api/video/get?id=${workout.id}&quality=url_1080`,
          name: '1080p',
        });
      }
      if (workout.url_4k) {
        vids.push({
          uri:
            config.baseUrl + `/api/video/get?id=${workout.id}&quality=url_4k`,
          name: '4k',
        });
      }
      setVideos(vids);
    }
  }, [workout]);

  function sendComment(comment) {
    Api.post('/api/training/send-comment', {comment, training_id: w.id})
      .then(response => {
        Api.get('/api/training/comments', {params: {training_id: w.id}})
          .then(response => {
            if (response?.data?.result?.comments) {
              setComments(response?.data?.result?.comments);
              setNewComment('');
            }
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  if (!workout) {
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
    <View style={{flex: 1, backgroundColor: styles.colors.white}}>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: styles.colors.gray5,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          rowGap: 5,
          paddingHorizontal: 4,
          flexWrap: 'wrap',
          paddingBottom: 40,
        }}>
        {isPlayerVisible && (
          <VideoPlayerModal
            isVisible={isPlayerVisible}
            hide={() => {
              setPlay(false);
              setIsPlayerVisible(false);
              setShowVideo(false); // Скрываем видео при закрытии плеера
              setIsFullscreen(false); // Сбрасываем fullscreen при закрытии
            }}
            startInPlayState={play}
            startInFullscreen={false}
            initialTime={time}
            updateTime={t => {
              setTime(t);
            }}
            containerStyle={{
              width: '100%',
              height: 500,
              borderRadius: 16,
            }}
            fullscreenStyle={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              borderRadius: 0,
            }}
            showVideo={showVideo}
            setShowVideo={setShowVideo}
            videos={videos}
            onNext={onNext}
            onPrev={onPrev}
            onFullscreenChange={setIsFullscreen} // Передаём callback для отслеживания fullscreen
          />
        )}
        {!showVideo ? (
          <ImageBackground
            source={{
              uri: config.baseUrl + workout.image,
            }}
            style={{
              width: '100%',
              height: 500,
              borderRadius: 16,
            }}
            imageStyle={{borderRadius: 16}}
            resizeMode={FastImage.resizeMode.cover}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 15,
                right: 15,
                zIndex: 1,
                width: 70,
                height: 70,
                alignSelf: 'center',
                borderRadius: 100,
                backgroundColor: styles.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                dispatch(last_workout(w));
                setShowVideo(true); // Показываем видео
                setIsPlayerVisible(true); // Открываем плеер
                setPlay(true); // Начинаем воспроизведение
              }}>
              <Ionicons
                name={'play'}
                size={styles.fonSize.h2}
                color={styles.colors.white}
              />
            </TouchableOpacity>
          </ImageBackground>
        ) : null}
        <View
          style={{
            minHeight: 235,
            borderRadius: 16,
            width: '100%',
            backgroundColor: styles.colors.background,
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
            {workout?.name?.toUpperCase()}
          </Text>

          <View style={{flexDirection: 'row', gap: 20}}>
            <TouchableOpacity onPress={() => setStep(0)}>
              <Text
                style={{
                  color:
                    step == 0 ? styles.colors.primary : styles.colors.regular,
                  fontSize: styles.fonSize.md,
                  fontWeight: '500',
                  textAlign: 'left',
                }}>
                {t('Overview')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep(1)}>
              <Text
                style={{
                  color:
                    step == 1 ? styles.colors.primary : styles.colors.regular,
                  fontSize: styles.fonSize.md,
                  fontWeight: '500',
                  textAlign: 'left',
                }}>
                {t('Exercises')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep(2)}>
              <Text
                style={{
                  color:
                    step == 2 ? styles.colors.primary : styles.colors.regular,
                  fontSize: styles.fonSize.md,
                  fontWeight: '500',
                  textAlign: 'left',
                }}>
                {t('Сommunity')}
              </Text>
            </TouchableOpacity>
          </View>

          {step == 0 && (
            <View>
              <Text
                style={{
                  color: styles.colors.regular,
                  fontSize: styles.fonSize.md,
                  fontWeight: '400',
                }}>
                {workout.description}
              </Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'space-between',
                  marginTop: 30,
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: styles.colors.regular,
                      fontSize: styles.fonSize.smd,
                      fontWeight: '400',
                    }}>
                    {workout.level}{' '}
                  </Text>
                  {renderDifficultyBars(workout.level)}
                </View>

                <Text
                  style={{
                    color: styles.colors.regular,
                    fontSize: styles.fonSize.smd,
                    fontWeight: '400',
                  }}>
                  {workout.duration_time} {t('min.')}
                </Text>
              </View>
            </View>
          )}
          {step == 1 && (
            <View style={{gap: 10, marginTop: 15}}>
              {workout.exercises.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}>
                  <View>
                    <Image
                      source={{
                        uri: config.baseUrl + item.image,
                      }}
                      style={{
                        width: 120,
                        height: 80,
                        borderRadius: 16,
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        padding: 2,
                        paddingHorizontal: 4,
                        backgroundColor: '#ffffff22',
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: '#ffffff11',
                      }}>
                      <Text
                        style={{
                          color: styles.colors.white,
                          fontSize: styles.fonSize.xs,
                          fontWeight: '400',
                        }}>
                        {item.duration_time}
                      </Text>
                    </View>
                  </View>
                  <View style={{gap: 5, flex: 1, height: '100%'}}>
                    <Text
                      style={{
                        color: styles.colors.black,
                        fontSize: styles.fonSize.lg,
                        fontWeight: '500',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: styles.colors.regular,
                        fontSize: styles.fonSize.smd,
                        fontWeight: '400',
                      }}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {step == 2 && (
            <View style={{gap: 10, marginTop: 15}}>
              {comments.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}>
                  <Image
                    source={{
                      uri: config.baseUrl + item.user.avatar,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  />
                  <View
                    style={{gap: 5, flex: 1, height: '100%', flexWrap: 'wrap'}}>
                    <Text
                      style={{
                        color: styles.colors.black,
                        fontSize: styles.fonSize.lg,
                        fontWeight: '500',
                      }}>
                      {item.user.name}{' '}
                      <Text
                        style={{
                          color: styles.colors.regular,
                          fontSize: styles.fonSize.md,
                          fontWeight: '400',
                        }}>
                        {item.comment}
                      </Text>
                    </Text>
                  </View>
                </View>
              ))}
              <CommentInput
                value={newComment}
                onChange={setNewComment}
                handleSend={() => sendComment(newComment)}
              />
            </View>
          )}
        </View>
      </ScrollView>
      {!isFullscreen && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 15,
            left: 15,
            zIndex: 9999,
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
      )}
    </View>
  );
}

// Локальные стили для полосок
const localStyles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  bar: {
    marginTop: 4,
    width: 5,
    height: 17,
    borderRadius: 2,
    borderColor: '#aaa',
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
