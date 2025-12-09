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
export default function Contacts({navigation}) {
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
          paddingTop: 70,
        }}>
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.g1,
            fontWeight: '1000',
            width: '100%',
            textAlign: 'left',
          }}>
          {t('Contacts').toUpperCase()}
        </Text>
        <Text
          style={{
            color: styles.colors.regular,
            fontSize: styles.fonSize.md,
            fontWeight: '300',
            width: '100%',
            textAlign: 'left',
          }}>
          {t(
            'Our team is always ready to communicate with our users, if you have any suggestions for training or want to get an individual training, you can always write to us or call.',
          )}
        </Text>
      </View>

      <View
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
        }}>
        <Image
          source={require('../images/insta.png')}
          style={{width: 50, height: 50}}
        />
        <View style={{flex: 1}}>
          <Text
            style={{
              color: styles.colors.black,
              fontSize: styles.fonSize.lg,
              fontWeight: '1000',
              textAlign: 'left',
            }}>
            {t('Instagram').toUpperCase()}
          </Text>
          <Text
            style={{
              color: styles.colors.primary,
              fontSize: styles.fonSize.md,
              fontWeight: '400',
              textAlign: 'left',
            }}>
            @StretchOn
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={30} color={styles.colors.gray} />
      </View>

      <View
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
        }}>
        <Image
          source={require('../images/twitter.png')}
          style={{width: 50, height: 50}}
        />
        <View style={{flex: 1}}>
          <Text
            style={{
              color: styles.colors.black,
              fontSize: styles.fonSize.lg,
              fontWeight: '1000',
              textAlign: 'left',
            }}>
            {t('Twitter/X').toUpperCase()}
          </Text>
          <Text
            style={{
              color: styles.colors.primary,
              fontSize: styles.fonSize.md,
              fontWeight: '400',
              textAlign: 'left',
            }}>
            @StretchOn_live
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={30} color={styles.colors.gray} />
      </View>

      <View
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
        }}>
        <Image
          source={require('../images/mail.png')}
          style={{width: 50, height: 50}}
        />
        <View style={{flex: 1}}>
          <Text
            style={{
              color: styles.colors.black,
              fontSize: styles.fonSize.lg,
              fontWeight: '1000',
              textAlign: 'left',
            }}>
            {t('Email').toUpperCase()}
          </Text>
          <Text
            style={{
              color: styles.colors.primary,
              fontSize: styles.fonSize.md,
              fontWeight: '400',
              textAlign: 'left',
            }}>
            sport@stretchon.fit
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={30} color={styles.colors.gray} />
      </View>

      <View
        style={{
          width: '96%',
          paddingTop: styles.paddingHorizontal,
          paddingHorizontal: styles.paddingHorizontal,
          margin: 6,
          marginVertical: 2,
          borderRadius: 16,
          paddingBottom: 20,
          flex: 1,
          gap: 10,
        }}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Text
            style={{
              color: styles.colors.regular,
              fontSize: styles.fonSize.sm,
              fontWeight: '300',
              width: '100%',
              textAlign: 'left',
            }}>
            {t(
              'If you have problems with the application, it is best to write to the support chat, our specialists respond there instantly.',
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}
