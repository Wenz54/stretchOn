import React, { memo } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import Text from './Text';
import FastImage from 'react-native-fast-image';
import styles from '../styles';
import { navigate } from '../services/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const width = Dimensions.get('window').width - styles.paddingHorizontal * 2;

function Progress({total = 0, current = 0}) {
  if (total === current) {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 3,
        }}>
        <Text
          style={{
            fontSize: styles.fonSize.smd,
            fontWeight: '600',
            color: styles.colors.black,
          }}>
          {current}/{total}
        </Text>
        <Ionicons
          name="checkmark-circle"
          size={styles.fonSize.md}
          color={styles.colors.black}
        />
      </View>
    );
  }
  return (
    <View style={{width: width * 0.34, alignItems: 'center'}}>
      <View
        style={{
          marginTop: 10,
          width: width * 0.34,
          height: 5,
          backgroundColor: styles.colors.grayLight,
          borderRadius: 4,
        }}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={[styles.colors.primary, styles.colors.grayLight]}
          style={{
            width: (width * 0.34 * current) / total,
            height: 5,
            borderRadius: 4,
          }}></LinearGradient>
        <MaterialCommunityIcons
          name="map-marker-check"
          size={styles.fonSize.md}
          color={styles.colors.primary}
          style={{
            position: 'absolute',
            bottom: 0,
            left: (width * 0.34 * current) / total - 10,
          }}
        />
      </View>
      <Text
        style={{
          fontSize: styles.fonSize.xs,
          fontWeight: '600',
          color: styles.colors.primary,
        }}>
        {current}/{total}
      </Text>
    </View>
  );
}

const HistoryCard = ({item, onPress = () => {}}) => {
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
        <Progress total={item.total} current={item.current} />
      </View>
    </TouchableOpacity>
  );
};

export default memo(HistoryCard);
