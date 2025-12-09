import React from 'react';
import { View } from 'react-native';
import styles from '../styles';
import MaskInput from 'react-native-mask-input';

export default StandardInput = ({
  value = '',
  onChange = () => {},
  secureTextEntry = false,
  size = 'md',
}) => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: styles.colors.white,
        borderRadius: styles.borderR,
      }}>
      <MaskInput
        value={value}
        placeholder={'+7 (999) 123-45-67'}
        onChangeText={(masked, unmasked) => onChange(unmasked)}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={styles.colors.placeholderColor}
        inputMode="numeric"
        mask={[
          '+',
          '7',
          '(',
          /\d/,
          /\d/,
          /\d/,
          ')',
          ' ',
          /\d/,
          /\d/,
          /\d/,
          ' - ',
          /\d/,
          /\d/,
          ' - ',
          /\d/,
          /\d/,
        ]}
        style={{
          backgroundColor: styles.colors.white,
          borderColor: styles.colors.primary,
          borderRadius: styles.borderR,
          padding: styles.padding[size],
          paddingLeft: 10,
          fontSize: styles.fonSize[size],
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          color: styles.colors.input,
        }}></MaskInput>
    </View>
  );
};
