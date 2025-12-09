import React, {useState, useRef} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import styles from '../styles';
import Text from './Text';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default StandardInput = ({
  width="100%",
  placeholder = '',
  value = '',
  onChange = () => {},
  secureTextEntry = false,
  size = 'md',
  autoFocus = false,
  style = {},
  mode = 'text',
  error = null,
}) => {
  const [is_secure, setIsSecuer] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false); // Добавляем состояние фокуса

  // Функция определения цвета границы
  const getBorderColor = () => {
    if (error) return styles.colors.red;
    if (isFocused) return styles.colors.primary; // Или любой другой зеленый цвет
    return styles.colors.black;
  };

  return (
    <View style={{width}}>
      <Text
        style={{
          marginVertical: -8,
          fonSize: styles.fonSize.sm,
          color: styles.colors.black,
        }}>
        {value.length > 0 && placeholder}
      </Text>

      <View
        style={{
          borderBottomWidth: 1.5,
          borderColor: getBorderColor(),
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems:'center'
        }}>
        <TextInput
          inputMode={mode}
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          onChangeText={onChange}
          secureTextEntry={is_secure}
          placeholderTextColor={styles.colors.black}
          onFocus={() => setIsFocused(true)} // Обработчик получения фокуса
          onBlur={() => setIsFocused(false)} // Обработчик потери фокуса
          style={{
            paddingBottom: 10,
            fontSize: styles.fonSize[size],
            width: '80%',
            alignContent: 'center',
            justifyContent: 'center',
            color: styles.colors.input,
            ...style,
          }}
        />
        {!secureTextEntry && value.length>0 && !error && (
          <Ionicons
          style={{
            color: styles.colors.primary,
            fontSize: styles.fonSize[size]+5,
            marginRight:10,
            fontWeight:'700'
          }}
          name={"checkmark"}
        />
        )}
        {secureTextEntry && value.length > 0 && (
          <TouchableOpacity  onPress={()=>setIsSecuer(!is_secure)}>
            <Ionicons
              style={{
                color: styles.colors.input,
                fontSize: styles.fonSize[size]+3,
                marginRight:10
              }}
              name={is_secure?"eye-off-outline":"eye-outline"}
            />
          </TouchableOpacity>
        )}
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
  );
};
