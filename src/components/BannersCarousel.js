import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import styles from '../styles';
import config from '../config';
import FastImage from 'react-native-fast-image';
import Swiper from './Swiper';

export default BannersCarousel = ({block, onPress}) => {
  const width = Dimensions.get('window').width - styles.paddingHorizontal * 2;
  const height = width * config.bannerHeight;
  if (block?.content?.items?.length) {
    const items = block.content.items;
    return (
      <Swiper horizontal height={height} loop autoplay removeClippedSubviews={false}>
        {items.map((item, index) => (
          <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(item)} key={index}>
            <FastImage
              source={{
                uri: item.main_pair.icon.image_path,
              }}
              style={{width, height, borderRadius: styles.borderR}}
              resizeMode={FastImage.resizeMode.stretch}
            />
          </TouchableOpacity>
        ))}
      </Swiper>
    );
  }
  return null;
};
