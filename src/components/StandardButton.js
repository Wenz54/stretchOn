import React from 'react';
import {TouchableHighlight} from 'react-native';
import Text from '../components/Text';
import styles from '../styles';

export default StandardButton = ({
  title = '',
  size = 'md',
  action = () => {},
  disabled = false,
  style = {},
  textStyle = {},
}) => {
  return (
    <TouchableHighlight
      underlayColor={styles.colors.highlight}
      style={{
        backgroundColor: disabled ? '#CCECEC' : styles.colors.primary,
        borderRadius: 16,
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
        paddingHorizontal: 30,
        ...style,
      }}
      onPress={() => {
        console.log('🔘 StandardButton pressed, disabled:', disabled);
        if (!disabled) {
          console.log('✅ Calling action function');
          action();
        } else {
          console.log('❌ Button is disabled');
        }
      }}>
      <Text
        style={{
          fontSize: styles.fonSize[size],
          color: styles.colors.primaryText,
          fontWeight: '600',
          textAlign: 'center',
          ...textStyle,
        }}>
        {title}
      </Text>
    </TouchableHighlight>
  );
};
