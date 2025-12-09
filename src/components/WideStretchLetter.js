import React from 'react';
import {View, Text as RNText} from 'react-native';

// Компонент для широких букв в шрифте StretchPro
// Растягивает по X и компенсирует тонкость дублированием
const WideStretchLetter = ({letter, fontSize, color}) => {
  return (
    <View style={{position: 'relative', width: fontSize * 1.8}}>
      {/* Основная буква */}
      <RNText
        style={{
          fontFamily: 'StretchPro',
          fontSize: fontSize,
          color: color,
          transform: [{scaleX: 1.8}],
          position: 'absolute',
        }}>
        {letter}
      </RNText>
      {/* Дубликат для утолщения (микро-сдвиг) */}
      <RNText
        style={{
          fontFamily: 'StretchPro',
          fontSize: fontSize,
          color: color,
          transform: [{scaleX: 1.8}],
          position: 'absolute',
          left: 0.3,
        }}>
        {letter}
      </RNText>
    </View>
  );
};

export default WideStretchLetter;


