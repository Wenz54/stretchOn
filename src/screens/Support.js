import React, {useState} from 'react';
import {View, Image, Dimensions, TouchableOpacity} from 'react-native';
import Text from '../components/Text';
import styles from '../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StandardButton from '../components/StandardButton';
import StandardInput from '../components/StandardInput';
import {useTranslation} from 'react-i18next';
import {usePersonalData} from '../hooks/usePersonalData';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ChangePassword from '../Modals/ChangePassword';
import config from '../config';
export default function Support({navigation}) {
  const width = Dimensions.get('window').width - styles.paddingHorizontal * 2;
  const height = Dimensions.get('window').height;
  const {t} = useTranslation();

  return (
    <View style={{flex: 1, backgroundColor: styles.colors.highlight}}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          backgroundColor: '#000',
          borderRadius: 50,
          width: 48,
          height: 48,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.pop()}>
        <Ionicons
          name="chevron-back-outline"
          size={styles.fonSize.h1}
          color={styles.colors.gray5}
        />
      </TouchableOpacity>

      <View
        style={{
          width: '96%',
          backgroundColor: styles.colors.white,
          alignItems: 'center',
          paddingTop: styles.paddingHorizontal,
          paddingHorizontal: styles.paddingHorizontal,
          margin: 6,
          marginVertical: 2,
          borderRadius: 16,
          paddingBottom: 20,
          paddingTop: 60,
        }}>
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.g1,
            fontWeight: '1000',
            width: '100%',
            textAlign: 'left',
          }}>
          {t('WHAT CAN I DO TO HELP YOU?').toUpperCase()}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          width: '96%',
          backgroundColor: styles.colors.white,
          alignItems: 'center',
          paddingHorizontal: styles.paddingHorizontal,
          margin: 6,
          borderRadius: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 10,
          paddingVertical: 15,
          marginVertical: 2,
        }}
        onPress={() => navigation.navigate('Contacts')}>
        <Ionicons name="mail-outline" size={30} color={styles.colors.primary} />
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.lg,
            fontWeight: '1000',
            flex: 1,
            textAlign: 'left',
          }}>
          {t('CONTACTS').toUpperCase()}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={30}
          color={styles.colors.regular}
        />
      </TouchableOpacity>

      <View
        style={{
          width: '96%',
          backgroundColor: styles.colors.black,
          paddingTop: styles.paddingHorizontal,
          paddingHorizontal: styles.paddingHorizontal,
          margin: 6,
          marginVertical: 2,
          borderRadius: 16,
          paddingBottom: 20,
          flex: 1,
          gap: 10,
        }}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={20}
          color={styles.colors.white}
        />
        <Text
          style={{
            color: styles.colors.white,
            fontSize: styles.fonSize.g1,
            fontWeight: '1000',
            width: '100%',
            textAlign: 'left',
          }}>
          {t('START NEW CHAT').toUpperCase()}
        </Text>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <StandardButton
            title={t("Write to chat")}
            action={() => navigation.navigate('SupportChat')}
          />
        </View>
      </View>
    </View>
  );
}
