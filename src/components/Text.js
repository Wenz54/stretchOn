// CustomText.js
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import i18n from 'i18next';

function getFamily(weight) {
  switch (weight) {
    case '100':
      return 'SF-Pro-Display-Ultralight';
    case '200':
      return 'SF-Pro-Display-Light';
    case '300':
      return 'SF-Pro-Display-Light';
    case '400':
      return 'SF-Pro-Display-Regular';
    case '500':
      return 'SF-Pro-Display-Semibold';
    case '600':
      return 'SF-Pro-Display-Bold';
    case '700':
      return 'SF-Pro-Display-Heavy';
    case '800':
      return 'SF-Pro-Display-Black';
    case '900':
      return 'SF-Pro-Display-Black';
    case '1000':
      if (i18n.language.startsWith('en')) {
        return 'StretchPro';
      } else if (i18n.language.startsWith('ru') || i18n.language.startsWith('uk')) {
        return 'benzin-bold';
      } else {
        return 'Gilroy-ExtraBold';
      }
    default:
      return 'SF-Pro-Display-Regular';
  }
}

export default function CustomText(props) {
  return (
    <Text
      numberOfLines={props.numberOfLines}
      style={[
        styles.defaultStyle,
        props.style,
        {
          fontFamily: getFamily(props?.style?.fontWeight || '400'),
          fontVariant: ['no-common-ligatures'],
        },
      ]}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  // ... add your default style here
  defaultStyle: {},
});
