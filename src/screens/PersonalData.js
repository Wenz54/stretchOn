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
export default function PersonalData({navigation}) {
  const width = Dimensions.get('window').width - styles.paddingHorizontal * 2;
  const height = Dimensions.get('window').height;
  const {t} = useTranslation();
  const {
    setNewAvatar,
    formData,
    userData,
    errors,
    handleInputChange,
    handleSubmit,
    status,
  } = usePersonalData();
  const [menuVisible, setMenuVisible] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const {email, name} = formData;

  return (
    <View style={{flex: 1, backgroundColor: styles.colors.white}}>
      {passVisible && <ChangePassword hide={() => setPassVisible(false)} />}
      {menuVisible && (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            position: 'absolute',
            zIndex: 999,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: '#00000000',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setMenuVisible(false)}>
          <View
            style={{
              position: 'absolute',
              top: 200,
              left: 100,
              backgroundColor: styles.colors.white,
              borderRadius: styles.borderR,
              padding: 5,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.16,
              shadowRadius: 6,
              minWidth: 200,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                launchCamera({mediaType: 'photo'}, res => {
                  setNewAvatar(res);
                  setMenuVisible(false);
                })
              }
              style={{
                borderBottomWidth: 1,
                width: '100%',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: styles.colors.black,
                  padding: 3,
                  fontSize: styles.fonSize.smd,
                }}>
                {t('Launch camera')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                launchImageLibrary({mediaType: 'photo'}, res => {
                  setNewAvatar(res);
                  setMenuVisible(false);
                })
              }
              style={{width: '100%', alignItems: 'center'}}>
              <Text
                style={{
                  color: styles.colors.black,
                  padding: 3,
                  fontSize: styles.fonSize.smd,
                }}>
                {t('Launch gallery')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

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
          width: '100%',
          height: '100%',
          backgroundColor: styles.colors.white,
          alignItems: 'center',
          paddingTop: styles.paddingHorizontal,
          paddingHorizontal: styles.paddingHorizontal,
          marginTop: 60,
        }}>
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.g2,
            fontWeight: '1000',
            width: '100%',
            textAlign: 'left',
          }}>
          {t('EDIT PROFILE').toUpperCase()}
        </Text>

        <View
          style={{width: '100%', alignItems: 'center', gap: 25, marginTop: 15}}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
            }}>
            {userData?.avatar?.length > 0 ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setMenuVisible(true)}>
                <Image
                  source={{uri: config.baseUrl + userData?.avatar}}
                  style={{
                    width: width / 3,
                    height: width / 3,
                    borderRadius: width,
                    backgroundColor: '#f00',
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  width: width / 3,
                  height: width / 3,
                  borderRadius: width,
                  backgroundColor: styles.colors.highlight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setMenuVisible(true)}>
                <MaterialIcons
                  name="person"
                  style={{color: styles.colors.primary, fontSize: 50}}
                />
              </TouchableOpacity>
            )}
            <Text
              style={{
                color: styles.colors.regular,
                fontSize: styles.fonSize.md,
                fontWeight: '400',
                width: '100%',
                textAlign: 'left',
              }}>
              Change photo
            </Text>
          </View>

          <StandardInput
            value={name}
            onChange={val => handleInputChange('name', val)}
            placeholder={`${t('Username')}`}
            size="md"
            width="100%"
            error={errors?.find(e => e.path === 'name')?.message || null}
          />

          <StandardInput
            value={email}
            mode="email"
            autoComplete="email"
            onChange={val => handleInputChange('email', val)}
            placeholder={`${t('Your')} ${t('Email')}`}
            size="md"
            width="100%"
            error={errors?.find(e => e.path === 'email')?.message || null}
          />

          <StandardButton
            title={t('Save')}
            action={handleSubmit}
            style={{padding: 5}}
          />

          <TouchableOpacity onPress={() => setPassVisible(true)}>
            <Text
              style={{
                color: styles.colors.black,
                fontSize: styles.fonSize.smd,
                textDecorationLine: 'underline',
              }}>
              {t('Change password')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
