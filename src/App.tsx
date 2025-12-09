import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider, useSelector} from 'react-redux';
import {store, persistor} from './redux/store/dev';
import {Image, StatusBar, Linking} from 'react-native';
import styles from './styles';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import {navigationRef} from './services/RootNavigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import WebPage from './screens/WebPage';
import Auth from './screens/Auth';
import PasswordRecovery from './screens/PasswordRecovery';
import Main from './screens/Main';
import config from './config';
import Registration from './screens/Registration';
import Loading from './screens/Loading';
import Workouts from './screens/Workouts';
import Meditations from './screens/Meditations';
import Profile from './screens/Profile';
import PersonalData from './screens/PersonalData';
import Notifications from './screens/Notifications';

import {useTranslation} from 'react-i18next';
import WorkoutDetailed from './screens/WorkoutDetailed';
import Comments from './screens/Comments';
import Directions from './screens/Directions';
import DirectionsMed from './screens/DirectionsMed';
import SubscriptionSelect from './screens/SubscriptionSelect';
import PayResult from './screens/PayResult';
import Support from './screens/Support';
import SupportChat from './screens/SupportChat';
import Contacts from './screens/Contacts';

import ErrorBoundary from 'react-native-error-boundary'; // Импортируем ErrorBoundary
import ErrorFallback from './components/ErrorFallBack'; // Импортируем ErrorFallback
import WebPagePay from './screens/WebPagePay';
import MySubscriptions from './screens/MySubscriptions';

const Tab = createBottomTabNavigator();
const AppStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const WorkoutsStack = createNativeStackNavigator();
const MeditationsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const state = store.getState();

function MainStackScreen() {
  return (
    <MainStack.Navigator
      initialRouteName={'Main'}
      screenOptions={{
        headerShown: false,
        navigationBarColor: styles.colors.background,
        animation: 'fade_from_bottom',
      }}>
      <MainStack.Screen name="Main" component={Main} />
    </MainStack.Navigator>
  );
}

function WorkoutsStackScreen() {
  return (
    <WorkoutsStack.Navigator
      initialRouteName={'Directions'}
      screenOptions={{
        headerShown: false,
        navigationBarColor: styles.colors.background,
        animation: 'fade_from_bottom',
      }}>
      <WorkoutsStack.Screen name="Directions" component={Directions} />
      <WorkoutsStack.Screen name="WorkoutsList" component={Workouts} />
    </WorkoutsStack.Navigator>
  );
}

function MeditationsStackScreen() {
  return (
    <MeditationsStack.Navigator
      initialRouteName={'DirectionsMed'}
      screenOptions={{
        headerShown: false,
        navigationBarColor: styles.colors.background,
        animation: 'fade_from_bottom',
      }}>
      <MeditationsStack.Screen name="DirectionsMed" component={DirectionsMed} />
      <MeditationsStack.Screen name="MeditationsList" component={Meditations} />
    </MeditationsStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      initialRouteName={'ProfileScreen'}
      screenOptions={{
        headerShown: false,
        navigationBarColor: styles.colors.background,
        animation: 'fade_from_bottom',
      }}>
      <ProfileStack.Screen name="ProfileScreen" component={Profile} />
    </ProfileStack.Navigator>
  );
}

function TabStack() {
  const {t} = useTranslation();
  const auth = useSelector((state: any) => state.auth);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveBackgroundColor: styles.colors.background,
        tabBarInactiveBackgroundColor: styles.colors.background,
        tabBarLabelStyle: {
          fontFamily: 'SF-Pro-Display-Regular',
          fontVariant: ['no-common-ligatures'],
        },
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === t('Home')) {
            return (
              <Image
                source={require('./images/home.png')}
                style={{width: 30, height: 30, tintColor: focused ? '#00B4B4' : '#202020'}}
              />
            );
          } else if (route.name === t('Workouts')) {
            return (
              <Image
                source={require('./images/sport.png')}
                style={{width: 30, height: 30, tintColor: focused ? '#00B4B4' : '#949494'}}
              />
            );
          } else if (route.name === t('Meditations')) {
            return (
              <Image
                source={require('./images/lotus.png')}
                style={{width: 30, height: 30, tintColor: focused ? '#00B4B4' : '#949494'}}
              />
            );
          } else {
            return (
              <Image
                source={require('./images/user.png')}
                style={{width: 30, height: 30, tintColor: focused ? '#00B4B4' : '#949494'}}
              />
            );
          }
        },
        tabBarActiveTintColor: '#2d2d2d',
        tabBarInactiveTintColor: '#949494',
      })}>
      <Tab.Screen name={t('Home')} component={MainStackScreen} />
      <Tab.Screen 
        name={t('Workouts')} 
        component={WorkoutsStackScreen}
        options={{
          unmountOnBlur: true, // Размонтируем стек при уходе с таба
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            // Предотвращаем стандартное поведение
            e.preventDefault();
            // Навигируем к Workouts табу и сбрасываем его стек
            navigation.navigate(t('Workouts'), {
              screen: 'Directions',
            });
          },
        })}
      />
      <Tab.Screen 
        name={t('Meditations')} 
        component={MeditationsStackScreen}
        options={{
          unmountOnBlur: true, // Размонтируем стек при уходе с таба
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            // Предотвращаем стандартное поведение
            e.preventDefault();
            // Навигируем к Meditations табу и сбрасываем его стек
            navigation.navigate(t('Meditations'), {
              screen: 'DirectionsMed',
            });
          },
        })}
      />
      <Tab.Screen name={t('Profile')} component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <Provider store={store}>
      <StatusBar
        animated={true}
        hidden={false}
        backgroundColor={styles.colors.background}
        barStyle={'dark-content'}
      />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <PersistGateApp />
      </ErrorBoundary>
    </Provider>
  );
}

// Deep linking configuration
const linking = {
  prefixes: ['stretchon://', 'https://stretchonspace.com', 'http://stretchonspace.com'],
  config: {
    screens: {
      PayResult: {
        path: 'PayResult',
        parse: {
          success: (success: string) => success === 'true',
        },
      },
      MainStack: 'home',
      Login: 'login',
      Registration: 'register',
      Subscriptions: 'subscriptions',
    },
  },
};

function PersistGateApp() {
  try {
    return (
      <PersistGate loading={null} persistor={persistor}>
        <AlertNotificationRoot theme="light">
          <NavigationContainer ref={navigationRef} linking={linking}>
            <AppStack.Navigator
              initialRouteName={'Loading'}
              screenOptions={{
                headerShown: false,
                navigationBarColor: styles.colors.white,
                animation: 'slide_from_right',
                orientation: 'portrait',
              }}>
              <AppStack.Screen name="Loading" component={Loading} />
              <AppStack.Screen name="Login" component={Auth} />
              <AppStack.Screen
                name="PasswordRecovery"
                component={PasswordRecovery}
              />
              <AppStack.Screen name="Registration" component={Registration} />
              <AppStack.Screen name="MainStack" component={TabStack} />
              <AppStack.Screen name="WebPage" component={WebPage} />
              <AppStack.Screen name="WebPagePay" component={WebPagePay} />
              <AppStack.Screen name="PersonalData" component={PersonalData} />
              <AppStack.Screen name="Notifications" component={Notifications} />
              <AppStack.Screen
                name="WorkoutDetailed"
                component={WorkoutDetailed}
              />
              <AppStack.Screen name="Comments" component={Comments} />
              <AppStack.Screen
                name="Subscriptions"
                component={SubscriptionSelect}
              />
              <AppStack.Screen name="PayResult" component={PayResult} />
              <AppStack.Screen name="Support" component={Support} />
              <AppStack.Screen name="SupportChat" component={SupportChat} />
              <AppStack.Screen name="Contacts" component={Contacts} />
              <AppStack.Screen name="MySubscriptions" component={MySubscriptions} />
            </AppStack.Navigator>
          </NavigationContainer>
        </AlertNotificationRoot>
      </PersistGate>
    );
  } catch (err) {
    console.error(err);
  }
}

export default App;
