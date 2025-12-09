import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import styles from '../styles';

export default function Loading({navigation, route}) {
  const auth = useSelector(state=>state.auth)


  useEffect(() => {
    if(auth.logged){
      navigation.replace('MainStack')
    } else {
      navigation.replace('Login')
    }
  }, [auth]);
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: styles.colors.background,
      }}>
     
    </View>
  );
}
