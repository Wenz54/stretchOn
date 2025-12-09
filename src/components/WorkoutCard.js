import React, { memo } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import Text from './Text';
import FastImage from 'react-native-fast-image';
import styles from '../styles';
import { navigate } from '../services/RootNavigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('window').width - styles.paddingHorizontal * 2;

const WorkoutCard = ({item, onPress = () => {}}) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        padding: 10,
        backgroundColor: styles.colors.white,
        width: width,
        alignItems: 'center',
        borderRadius: styles.borderR,
        rowGap: 8,
        elevation: 5,
        shadowColor: '#888',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.16,
        shadowRadius: 6,
      }}
      onPress={() => {
        navigate('WorkoutDetailed', {workout: item});
      }}>
      <FastImage
        source={{
          uri: item.image,
        }}
        style={{
          width: '100%',
          height: 170,
          borderRadius: styles.borderR,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <Text
          numberOfLines={2}
          style={{
            width: '60%',
            fontSize: styles.fonSize.smd,
            fontWeight: '600',
            color: styles.colors.black,
          }}>
          {item.name}
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <View
          style={{
            width: '50%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap:20
          }}>
          <TouchableOpacity>
            <FontAwesome
              name="heart-o"
              size={styles.fonSize.h1}
              color={styles.colors.red}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            navigation.push('Comments',{item})
          }}>
            <FontAwesome
              name="comment-o"
              size={styles.fonSize.h1}
              color={styles.colors.input}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <FontAwesome
            name="cc-visa"
            size={styles.fonSize.h1}
            color={styles.colors.input}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default memo(WorkoutCard);
