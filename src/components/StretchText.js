import React from 'react';
import {Text as RNText, Platform} from 'react-native';

// Компонент для текста с поддержкой растянутых букв Stretch Pro
const StretchText = ({children, style, wide = false}) => {
  // Для растянутых букв используем специальные стили
  const wideStyle = wide ? {
    fontFamily: 'StretchPro',
    // На Android можем попробовать fontFeatureSettings
    ...(Platform.OS === 'android' && {
      fontFeatureSettings: '"ss01" 1', // Stylistic Set 1
    }),
    // На iOS используем fontVariant
    ...(Platform.OS === 'ios' && {
      fontVariant: ['stylistic-one'],
    }),
  } : {};

  return (
    <RNText style={[style, wideStyle]}>
      {children}
    </RNText>
  );
};

export default StretchText;


