import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Text from './Text';

import styles from '../styles';

const CodeInput = ({
  value = '',
  onChange = () => {},
  codeLength = 4,
  onCodeComplete,
  error = null
}) => {
  const inputRef = useRef();

  // Создаем массив для отображения отдельных цифр
  const codeDigitsArray = new Array(codeLength).fill(0);

  const handleCodeChange = text => {
    // Убираем все нецифровые символы
    const newCode = text.replace(/[^0-9]/g, '');

    // Ограничиваем длину кода
    if (newCode.length <= codeLength) {
      onChange(newCode);
    }
  };

  useEffect(()=>{
    console.log(value)
    value.length === codeLength && onCodeComplete?.()
  },[value])

  const handlePress = () => {
    inputRef.current?.focus();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={stylesd.container}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleCodeChange}
          keyboardType="number-pad"
          maxLength={codeLength}
          style={stylesd.hiddenInput}
        />
        <View style={stylesd.cellsContainer}>
          {codeDigitsArray.map((_, index) => {
            const digit = value[index] || '';

            return (
              <View
                key={index}
                style={[stylesd.cell, digit && stylesd.filledCell]}>
                <Text style={stylesd.digit}>{digit}</Text>
              </View>
            );
          })}
        </View>
        {error && (
        <Text
          style={{
            fonSize: styles.fonSize.smd,
            color: styles.colors.red,
            paddingTop: 5,
          }}>
          {error}
        </Text>
      )}
      </View>
      
    </TouchableWithoutFeedback>
  );
};

const stylesd = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
  },
  cellsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 5,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusedCell: {
    borderColor: styles.colors.primary,
    borderWidth: 1.5,
  },
  filledCell: {
    borderColor: styles.colors.primary,
    borderWidth: 1.2,
  },
  digit: {
    fontSize: 20,
    color: '#000',
  },
});

export default CodeInput;
