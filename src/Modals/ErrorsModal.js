import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import Text from '../components/Text';
import StandardButton from '../components/StandardButton';
import styles from '../styles';
import { useTranslation } from 'react-i18next';
export default ErrorsModal = ({errors = [], action = () => {}}) => {
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  const dispatch = useDispatch();
  const {t} = useTranslation();
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        position: 'absolute',
        zIndex: 999,
        width,
        height,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() => dispatch({type: 'HIDE_MODAL'})}>
      <View
        style={{
          width: '90%',
          maxHeight:'100%',
          backgroundColor: '#fff',
          alignItems: 'center',
          borderRadius: styles.borderR,
          padding: styles.paddingHorizontal,
          justifyContent: 'space-around',
          gap: 10,
        }}>
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.h1,
            fontWeight: '600',
          }}>
          {t('Error')}
        </Text>
        {errors.map((item, index) => (
          <Text
            style={{
              color: styles.colors.black,
              fontSize: styles.fonSize.md,
              fontWeight: '500',
              width:'100%'
            }}
            key={index}>
            {item.url}{' - '}
            <Text
              style={{
                color: styles.colors.red,
                fontSize: styles.fonSize.md,
                fontWeight: '500',
              }}>
              {item.message}
            </Text>
          </Text>
        ))}
        <StandardButton
          style={{
            padding: 5,
            paddingHorizontal: styles.paddingHorizontal,
            backgroundColor: styles.colors.red,
          }}
          title={t('Reload page')}
          action={action}
        />
      </View>
    </TouchableOpacity>
  );
};
