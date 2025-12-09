import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Text from '../components/Text';
import styles from '../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default HeaderBack = ({
  title = '',
  action = () => {},
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        marginTop: insets.top,
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 7,
        backgroundColor: styles.colors.background,
        marginBottom: 3,
      }}>
      <TouchableOpacity
        style={{position: 'absolute', right: 10}}
        onPress={action}>
        <Ionicons
          name="close-outline"
          size={styles.fonSize.g2}
          color={styles.colors.primary}
        />
      </TouchableOpacity>
      <Text
        style={{
          margin: 'auto',
          fontSize: styles.fonSize.xl,
          color: styles.colors.grayDark,
          textAlign: 'center',
          fontWeight: '500',
        }}>
        {title}
      </Text>
    </View>
  );
};
