import React, {memo} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import Text from './Text';
import FastImage from 'react-native-fast-image';
import styles from '../styles';
import {navigate} from '../services/RootNavigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const width = Dimensions.get('window').width - styles.paddingHorizontal * 2;
const itemWidth = width - 100;
const CommentItem = ({item, onPress = () => {}}) => {
  const my_id = useSelector(state => state.auth.userData.id);
  return (
    <View
      style={{
        width,
        flexDirection: item.user_id === my_id ? 'row-reverse' : 'row',
        justifyContent: 'flex-start',
        gap: 10,
      }}>
      {item.user_avatar ? (
        <FastImage
          source={{uri: item.user_avatar || ''}}
          style={{width: 50, height: 50, borderRadius: 70}}
        />
      ) : (
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 70,
            backgroundColor: styles.colors.background,
          }}></View>
      )}
      <View style={{width: itemWidth, rowGap: 5}}>
        <Text
          style={{
            color: styles.colors.black,
            fontWeight: '600',
            textAlign: item.user_id === my_id ? 'right' : 'left',
          }}>
          {item.user_name}
          {` `}
          <Text
            style={{
              marginLeft: 10,
              color: styles.colors.gray,
              fontWeight: '500',
            }}>
            {item.date}
          </Text>
        </Text>
        <View
          style={{
            width: itemWidth,
            padding: 8,
            backgroundColor: styles.colors.grayLight,
            borderRadius: styles.borderR,
          }}>
          <Text
            style={{
              marginLeft: 10,
              color: styles.colors.gray,
              fontWeight: '500',
              
            }}>
            {item.text}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default memo(CommentItem);
