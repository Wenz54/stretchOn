// CustomText.js
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from '../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function MenuItem({title = '', onPress = () => {}, no_border=false}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '100%',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor:styles.colors.gray4,
        borderBottomWidth:no_border?0:1.2,
        paddingVertical:7,
        paddingHorizontal:8
      }}>
      <Text style={{color:styles.colors.black, fontSize:styles.fonSize.md, fontWeight:'400'}}>{title}</Text>
      <Ionicons
        name="chevron-forward"
        style={{color: styles.colors.regular, fontSize: 20}}
      />
    </TouchableOpacity>
  );
}

