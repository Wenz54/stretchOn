import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import Text from '../components/Text';
import apiClient from '../services/api';
import config from '../config';
import { removeHtmlTags, filterByLanguage, getDirectionName, getDirectionDescription } from '../services/utils';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DirectionsMed({navigation, route}) {
  const {t, i18n} = useTranslation();
  const Api = apiClient();
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    // Get all directions and all meditations in parallel
    Promise.all([
      Api.get('/api/direction/get-all', {params: {type: 'meditation'}}),
      Api.get('/api/training/get-all', {params: {type: 'meditation'}})
    ])
      .then(([directionsRes, meditationsRes]) => {
        if (directionsRes?.data?.result?.directions) {
          const allDirections = directionsRes.data.result.directions.filter(i => i.id !== 1);
          const allMeditations = meditationsRes?.data?.result?.trainings || [];
          
          // Фильтруем медитации по языку пользователя
          const meditations = filterByLanguage(allMeditations, i18n.language);
          console.log(`DirectionsMed: Filtered ${allMeditations.length} meditations to ${meditations.length} for lang ${i18n.language}`);
          console.log('Meditations received:', meditations.length);
          console.log('Sample meditation:', meditations[0]);
          
          // Get direction IDs that have meditations
          const directionIdsWithMeditations = new Set();
          meditations.forEach(meditation => {
            // Check multiple possible field names for directories
            const directories = meditation.directory || meditation.directories || meditation.direction_ids || [];
            
            if (Array.isArray(directories)) {
              directories.forEach(dir => {
                // Handle both object with id and plain id
                const dirId = typeof dir === 'object' ? dir.id : dir;
                directionIdsWithMeditations.add(dirId);
              });
            } else if (meditation.direction_id) {
              // Handle single direction_id field
              directionIdsWithMeditations.add(meditation.direction_id);
            }
          });
          
          console.log('Direction IDs with meditations:', Array.from(directionIdsWithMeditations));
          
          // Filter directions that have at least one meditation
          const filteredDirections = allDirections.filter(dir => 
            directionIdsWithMeditations.has(dir.id)
          );
          
          console.log('Filtered directions count:', filteredDirections.length);
          console.log('All directions count:', allDirections.length);
          
          // If no filtered directions, show all (fallback)
          setDirections(filteredDirections.length > 0 ? filteredDirections : allDirections);
        }
      })
      .catch(error => {
        console.log('Error loading directions:', error);
        // Fallback: show all directions with meditations
        Api.get('/api/direction/get-all', {params: {type: 'meditation'}})
          .then(response => {
            if (response?.data?.result?.directions) {
              setDirections(response?.data?.result?.directions.filter(i => i.id !== 1));
            }
          })
          .catch(err => console.log(err));
      });
  }, []);

  // Обработчик клика по направлению
  const handleDirectionPress = (item) => {
    // Просто открываем список медитаций, доступ проверяется внутри
    navigation.push('MeditationsList', {direction: item, fromHome: false});
  };

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
                onPress={() => handleDirectionPress(item)}
                style={{gap: 5, position: 'relative'}}>
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
