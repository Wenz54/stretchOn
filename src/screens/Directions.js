import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
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
import {removeHtmlTags, filterByLanguage, getDirectionName, getDirectionDescription} from '../services/utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default function Directions({navigation, route}) {
  const {t, i18n} = useTranslation();
  const Api = apiClient();
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    // Get all directions and all trainings in parallel
    Promise.all([
      Api.get('/api/direction/get-all', {params: {type: 'training'}}),
      Api.get('/api/training/get-all', {params: {type: 'training'}})
    ])
      .then(([directionsRes, trainingsRes]) => {
        if (directionsRes?.data?.result?.directions) {
          const allDirections = directionsRes.data.result.directions.filter(i => i.id !== 1);
          const allTrainings = trainingsRes?.data?.result?.trainings || [];
          
          // Фильтруем тренировки по языку пользователя
          const trainings = filterByLanguage(allTrainings, i18n.language);
          console.log(`Filtered ${allTrainings.length} trainings to ${trainings.length} for lang ${i18n.language}`);
          
          // Get direction IDs that have trainings
          const directionIdsWithTrainings = new Set();
          trainings.forEach(training => {
            // Check if training has directory array (relation from backend)
            if (training.directory && Array.isArray(training.directory)) {
              training.directory.forEach(dir => directionIdsWithTrainings.add(dir.id));
            }
          });
          
          // Filter directions that have at least one training
          const filteredDirections = allDirections.filter(dir => 
            directionIdsWithTrainings.has(dir.id)
          );
          
          console.log('Directions with trainings:', filteredDirections.length);
          setDirections(filteredDirections);
        }
      })
      .catch(error => {
        console.log('Error loading directions:', error);
        // Fallback: show all directions with trainings
        Api.get('/api/direction/get-all', {params: {type: 'training'}})
          .then(response => {
            if (response?.data?.result?.directions) {
              setDirections(response?.data?.result?.directions.filter(i => i.id !== 1));
            }
          })
          .catch(err => console.log(err));
      });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: styles.colors.background}}>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: styles.colors.background,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          rowGap: styles.paddingHorizontal,
          paddingTop: styles.paddingHorizontal,
          paddingHorizontal: styles.paddingHorizontal,
          paddingBottom: 90 + styles.paddingHorizontal * 2,
        }}>
        <View
          style={{
            borderRadius: 16,
            width: '100%',
            backgroundColor: styles.colors.background,
            padding: 10,
            gap: 10,
            margin: 3,
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
            onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={styles.fonSize.h1}
              color={styles.colors.gray5}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: styles.colors.black,
              fontSize: 34,
              fontWeight: '1000',
              width: '100%',
              textAlign: 'left',
              marginTop: 15,
              marginBottom: 7,
            }}>
            {t('Find what moves you').toUpperCase()}
          </Text>
          {directions.map((item, index) => (
            <View
              key={index}
              style={{
                paddingBottom: 28,
                marginBottom: 8,
                borderBottomWidth: index < directions.length - 1 ? 1 : 0,
                borderBottomColor: '#ECF7F7',
              }}>
              <TouchableOpacity
                onPress={() => navigation.push('WorkoutsList', {direction: item, fromHome: false})}
                style={{gap: 5}}>
                <Image
                  source={{uri: config.baseUrl + item.image_home}}
                  style={{
                    width: '100%',
                    height: 160,
                    borderRadius: 16,
                    backgroundColor: styles.colors.background,
                    resizeMode: 'cover',
                  }}
                />
                <Text
                  style={{
                    color: styles.colors.black,
                    fontSize: styles.fonSize.md,
                    fontWeight: '500',
                    textAlign: 'left',
                    marginTop: 2,
                  }}>
                  Stretch On {getDirectionName(item, i18n.language)}
                </Text>
                <Text
                  style={{
                    color: '#202020',
                    fontSize: styles.fonSize.smd,
                    fontWeight: '300',
                    textAlign: 'left',
                    marginTop: -8,
                  }}>
                  {item.count_training} {t('workouts')}
                </Text>
                <Text
                  style={{
                    color: '#202020',
                    fontSize: styles.fonSize.smd,
                    fontWeight: '300',
                    textAlign: 'left',
                  }}>
                  {removeHtmlTags(getDirectionDescription(item, i18n.language))}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
