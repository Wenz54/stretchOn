import apiClient from '../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

export function useMainContent() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const logged = auth.logged;
  const userData = auth.userData;

  const Api = apiClient();

  const [errors, setErrors] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [haveNotifications, setHaveNotifications] = useState(false);
  const [directions, setDirections] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  async function handleLoadUserData() {
    return Api.post('/api/user/me')
      .then(res => {
        dispatch({type: 'SET_USERDATA', payload: {...res?.data.user}});
        return [];
      })
      .catch(err => {
        if (err.response?.data?.error) {
          return [{url: err?.request._url, message: err.response?.data?.error}];
        } else {
          return [{url: err?.request._url, message: err.message}];
        }
      });
  }

 
  async function handleRefresh() {
    setErrors([]);
    let errs = [
      ...(await handleLoadUserData()),
    ];
    //setErrors(errs);
    setRefreshing(false);
    setIsFirstLoad(false)
  }

  useEffect(() => {
    if (!logged) {
      return navigation.replace('Login');
    }
  }, [logged]);

  useEffect(() => {
    SplashScreen.hide();
    handleRefresh();
  }, []);

  return {
    refreshing,
    errors,
    haveNotifications,
    directions,
    handleRefresh,
    isFirstLoad
  };
}
