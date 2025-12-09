import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
  Touchable,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import styles from '../styles';
import SearchInputHeader from '../headers/SearchInputHeader';
import {useWorkoutList} from '../hooks/useWorkoutList';
import ScrollSelect from '../components/ScrollSelect';
import {useTranslation} from 'react-i18next';
import WorkoutCard from '../components/WorkoutCard';
import PayRequest from '../Modals/PayRequest';
import StandardButton from '../components/StandardButton';
import Text from '../components/Text';
import apiClient from '../services/api';
import config from '../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {removeHtmlTags, filterByLanguage, getDirectionName, getDirectionDescription} from '../services/utils';
import { useIsFocused } from '@react-navigation/native';
import {useSelector} from 'react-redux';

export default function Workouts({navigation, route}) {
  const {t, i18n} = useTranslation();
  const isFocused = useIsFocused(); 
  const userData = useSelector(state => state.auth).userData;
  let direction_id = route?.params?.direction?.id;

  const [direction, setDirection] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const Api = apiClient();
  const [filters, setFilters] = useState({});
  useEffect(() => {
    // console.log(direction_id)
    Api.get('/api/direction/get', {params: {id: direction_id}})
      .then(response => {
        if (response?.data?.result) {
          setDirection(response?.data?.result);
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  }, [direction_id, isFocused]);

  useEffect(() => {
    fetchWorkouts();
    fetchFilters();
    fetchSubscriptions();
  }, [direction_id, isFocused]);

  const fetchSubscriptions = async () => {
    try {
      const response = await Api.get('/api/subscription/my');
      if (response?.data?.result) {
        setSubscriptions(response.data.result);
        console.log('Active subscriptions:', response.data.result);
      }
    } catch (error) {
      console.log('Error fetching subscriptions:', error);
    }
  };

  // Проверка доступа к конкретной тренировке
  const hasAccessToTraining = (item) => {
    // Если бесплатная - доступна всем
    if (item.free) {
      return true;
    }

    // Проверяем наличие активной подписки на это направление или на все направления
    const hasActiveSubscription = subscriptions.some(sub => {
      // Подписка на все направления (если больше 1 направления в подписке)
      if (sub.directory && Array.isArray(sub.directory) && sub.directory.length > 1) {
        return true;
      }
      
      // Подписка на конкретное направление
      if (sub.directory && Array.isArray(sub.directory)) {
        return sub.directory.some(dir => dir.id === direction_id);
      }
      
      return false;
    });

    // Возвращаем true если есть подписка ИЛИ если item.available (на случай других механизмов доступа)
    return hasActiveSubscription || item.available;
  };

  const fetchWorkouts = async () => {
    try {
      // Копируем активные фильтры
      const filtersForRequest = {...activeFilters};

      // Переименовываем difficulty в level, если такой фильтр есть
      if (filtersForRequest.difficulty) {
        filtersForRequest.level = filtersForRequest.difficulty;
        delete filtersForRequest.difficulty;
      }

      const response = await Api.get('/api/training/get-all', {
        params: {direction_id, type: 'training', ...filtersForRequest},
      });

      if (response?.data?.result?.trainings) {
        const allTrainings = response.data.result.trainings;
        // Фильтруем тренировки по языку пользователя
        const filteredTrainings = filterByLanguage(allTrainings, i18n.language);
        console.log(`Workouts: Filtered ${allTrainings.length} to ${filteredTrainings.length} for lang ${i18n.language}`);
        setWorkouts(filteredTrainings);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchFilters = async () => {
    try {
      const response = await Api.get('/api/training/get-filters');
      if (response?.data?.result) {
        setFilters(response?.data?.result);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  if (showFilters) {
    return (
      <View style={{flex: 1, backgroundColor: styles.colors.background}}>
        <View
          style={{
            borderRadius: 16,
            backgroundColor: styles.colors.background,
            padding: 10,
            gap: 20,
            marginVertical: 3,
            flex: 1,
          }}>
          <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              gap: 16,
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
              onPress={() => setShowFilters(false)}>
              <Ionicons
                name="chevron-back-outline"
                size={styles.fonSize.h1}
                color={styles.colors.gray5}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 34,
                fontWeight: '1000',
                color: styles.colors.black,
              }}>
              {t('Filters').toUpperCase()}
            </Text>

            {Object.keys(filters).map((name, index) => (
              <View style={{gap: 10}} key={index}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'StretchPro',
                    fontWeight: '1000',
                    color: styles.colors.black,
                  }}>
                  {name.toUpperCase()}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                    rowGap: 8,
                  }}>
                  {filters[name].map((item, index) => {
                    let isSelected = activeFilters[name]?.includes(item); // Проверяем, выбран ли элемент
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          let cp = {...activeFilters};
                          if (!cp[name]) {
                            cp[name] = [];
                          }
                          if (isSelected) {
                            cp[name] = cp[name].filter(i => i !== item); // Удаляем элемент, если он уже выбран
                          } else {
                            cp[name].push(item); // Добавляем элемент, если он не выбран
                          }
                          setActiveFilters(cp);
                        }}
                        style={{
                          borderRadius: 16,
                          borderWidth: 1.5,
                          borderColor: styles.colors.black,
                          padding: 10,
                          paddingHorizontal: 16,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: isSelected
                            ? styles.colors.black
                            : styles.colors.white,
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: '500',
                            color: isSelected
                              ? styles.colors.primary
                              : styles.colors.black,
                          }}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>

          <StandardButton
            title={t('Apply')}
            action={() => {
              setShowFilters(false);
              fetchWorkouts();
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: styles.colors.background}}>
      {showPay && (
        <PayRequest navigation={navigation} hide={() => setShowPay(false)} />
      )}

      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: styles.colors.grayLight,
          flexGrow: 1,
        }}
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
              navigation.navigate('Directions');
            }
          }}>
          <Ionicons
            name="chevron-back-outline"
            size={styles.fonSize.h1}
            color={styles.colors.gray5}
          />
        </TouchableOpacity>
        <Image
          source={{uri: config.baseUrl + route?.params?.direction?.image_home}}
          style={{
            width: '100%',
            height: 320,
            borderRadius: 16,
            backgroundColor: styles.colors.background,
            resizeMode: 'cover',
          }}
        />

        <View
          style={{
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
            STRETCH{'\n'}ON{' '}
            <Text
              style={{
                color: styles.colors.primary,
                fontSize: styles.fonSize.icon,
                fontWeight: '1000',
              }}>
              {getDirectionName(route?.params?.direction, i18n.language).toUpperCase()}
            </Text>
          </Text>
          <Text
            style={{
              color: styles.colors.black,
              fontSize: styles.fonSize.smd,
              fontWeight: '300',
              textAlign: 'left',
            }}>
            {route?.params?.direction?.count_training} {t('workouts')}
          </Text>
          <Text
            style={{
              color: '#202020',
              fontSize: styles.fonSize.smd,
              fontWeight: '300',
              textAlign: 'left',
            }}>
            {removeHtmlTags(getDirectionDescription(route?.params?.direction, i18n.language))}
          </Text>
        </View>
        <View
          style={{
            borderRadius: 16,
            width: '100%',
            backgroundColor: styles.colors.background,
            padding: 10,
            gap: 10,
            minHeight: 200,
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
                fontSize: styles.fonSize.icon,
                fontWeight: '1000',
                textAlign: 'left',
              }}>
              {t('Workout').toUpperCase()}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#000',
                borderRadius: 50,
                width: 48,
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setShowFilters(true)}>
              <Ionicons
                name="options-outline"
                size={styles.fonSize.h1}
                color={styles.colors.gray5}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 13,
              rowGap: 13,
            }}>
            {workouts.length > 0 &&
              workouts.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{width: '48%'}}
                  onPress={() => {
                    if (!hasAccessToTraining(item)) {
                      setShowPay(true);
                    } else {
                      navigation.push('WorkoutDetailed', {
                        workout: {...item, direction_id},
                      });
                    }
                  }}>
                  <Image
                    source={{uri: config.baseUrl + item.image}}
                    style={{width: '100%', height: 239.2196807861328, borderRadius: 24}}
                  />
                  {!hasAccessToTraining(item) && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        width: '100%',
                        height: 239.2196807861328,
                        borderRadius: 24,
                        overflow: 'hidden',
                        backgroundColor: 'transparent',
                      }}>
                      <BlurView
                        style={{
                          flex: 1,
                        }}
                        blurType="light"
                        blurAmount={3}
                        reducedTransparencyFallbackColor="rgba(255,255,255,0.3)">
                        <View style={{
                          flex: 1,
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                          <Ionicons
                            name="lock-closed"
                            size={34}
                            color="#FFFFFF"
                          />
                          <Text
                            style={{
                              color: '#FFFFFF',
                              fontSize: styles.fonSize.md,
                              fontWeight: '600',
                              textAlign: 'center',
                              marginTop: 8,
                            }}>
                            {t('Unlock this workout')}
                          </Text>
                        </View>
                      </BlurView>
                    </View>
                  )}
                  <Text
                    style={{
                      color: styles.colors.black,
                      fontSize: styles.fonSize.lg,
                      fontWeight: '400',
                    }}>
                    {item.name}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        color: styles.colors.regular,
                        fontSize: styles.fonSize.xs,
                        fontWeight: '400',
                      }}>
                      {item.duration_time} {t('min.')} | {item.level}{' '}
                    </Text>
                    {renderDifficultyBars(item.level)}
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
                  justifyContent:'space-between',
                  gap: 15,
                  borderRadius: 16,
                  alignItems:'center'
                }}>
                <Ionicons
                  name="search"
                  size={30}
                  color={styles.colors.primary}
                />
                <Text
                  style={{
                    flex:1,
                    color: styles.colors.regular,
                    fontSize: styles.fonSize.lg,
                    fontWeight: '4000',
                    textAlign: 'left',
                  }}>
                  {t('Nothing found. Adjust your filtering criteria.')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
