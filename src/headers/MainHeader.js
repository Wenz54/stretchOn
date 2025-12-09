import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import Text from '../components/Text';
import styles from '../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { navigate } from '../services/RootNavigation';
import config from '../config';
export default MainHeader = ({haveNotifications = false}) => {
  const insets = useSafeAreaInsets();
  const auth = useSelector(state => state.auth);
  return (
    <View
      style={{
        marginTop: insets.top,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: styles.paddingHorizontal,
        paddingVertical: 8,
        backgroundColor: styles.colors.white,
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          width: '80%',
          alignItems: 'flex-start',
          gap: 10,
        }}
        onPress={() => {}}>
        {auth.userData?.avatar ? (
          <Image
            source={{uri:config.baseUrl+auth.userData?.avatar}}
            style={{width: 60, height: 60, borderRadius: 70}}
          />
        ) : (
          <View style={{width: 60, height: 60, borderRadius: 70, backgroundColor:styles.colors.primary, justifyContent:'center', alignItems:'center'}}>
            <Ionicons
              name="person"
              size={styles.fonSize.g3}
              color={styles.colors.background}
            />
          </View>
        )}
        <View style={{height: 60, justifyContent: 'space-between'}}>
          <Text
            style={{
              width: '100%',
              color: styles.colors.black,
              fontSize: styles.fonSize.xl,
              fontWeight: '600',
            }}>
            {auth.userData?.name || ''}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
            <MaterialCommunityIcons
              name="crown"
              size={styles.fonSize.xl}
              color={styles.colors.yellow}
            />
            <Text
              style={{
                width: '100%',
                color: styles.colors.black,
                fontSize: styles.fonSize.smd,
                fontWeight: '600',
              }}>
              PRO
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: styles.colors.grayLight,
          padding: 3,
          borderRadius: 80,
        }}
        onPress={() => {navigate('Notifications')}}>
        <Ionicons
          name="notifications"
          size={styles.fonSize.g1}
          color={styles.colors.black}
        />
        {haveNotifications && (
          <View
            style={{
              position: 'absolute',
              zIndex: 2,
              top: 2,
              right: 1,
              width: 11,
              height: 11,
              borderRadius: 10,
              backgroundColor: styles.colors.primary,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
