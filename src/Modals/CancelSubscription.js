import React from 'react';
import {View, TouchableOpacity, Dimensions, Keyboard} from 'react-native';
import {useDispatch} from 'react-redux';
import Text from '../components/Text';
import StandardButton from '../components/StandardButton';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import {useChangePassword} from '../hooks/useChangePassword';
import {useKeyboardVisible} from '../hooks/useKeyboardVisible';
import StandardButtonOutline from '../components/StandardButtonOutline';
import {BlurView} from '@react-native-community/blur';
export default CancelSubscriptionModal = ({
  handleSubmit = () => {},
  hide = () => {},
}) => {
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const isKeyboardVisible = useKeyboardVisible();
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 999,
        width,
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
      <BlurView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        blurType="light"
        blurAmount={3}
        reducedTransparencyFallbackColor="rgba(255,255,255,0.2)">
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
          }}
          onPress={() => (!isKeyboardVisible ? hide() : Keyboard.dismiss())}
        />
      </BlurView>
      <View
        style={{
          width: '100%',
          maxHeight: '60%',
          backgroundColor: '#fff',
          alignItems: 'center',
          padding: styles.paddingHorizontal,
          justifyContent: 'space-around',
          gap: 10,
          paddingVertical: 20,
        }}>
        <Text
          style={{
            color: styles.colors.black,
            fontSize: styles.fonSize.h1,
            fontWeight: '1000',
            width: '100%',
          }}>
          {t('Cancel Subscription').toUpperCase()}
        </Text>
        <Text
          style={{
            color: '#777',
            fontSize: styles.fonSize.md,
            fontWeight: '400',
            width: '100%',
            textAlign: 'left',
          }}>
          {t(
            'Are you sure you want to cancel your subscription?',
          )}
        </Text>
        <StandardButton
          style={{
            padding: 5,
            paddingHorizontal: styles.paddingHorizontal,
            backgroundColor: styles.colors.primary,
          }}
          title={t('Go Back')}
          action={() => {
            console.log('❌ User clicked GO BACK button (hide modal)');
            hide();
          }}
        />
        <StandardButtonOutline 
          title={t('Cancel Subscription')} 
          action={() => {
            console.log('✅ User clicked CANCEL SUBSCRIPTION button (cancel subscription)');
            handleSubmit();
          }} 
        />
      </View>
    </View>
  );
};
