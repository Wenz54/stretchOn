import axios from 'axios';
import config from '../config';
import {store} from '../redux/store/dev';
import {Platform} from 'react-native';
import Text from '../components/Text';
import {Toast, ALERT_TYPE} from 'react-native-alert-notification';
const apiClient = (file = false) => {
  const state = store.getState();
  let auth = state.auth;

  let token = undefined;
  if (state.auth.logged) {
    token = `Bearer ${state.auth.token}`;
  }
  
  console.log('🌐 API Client - Config baseURL:', config.baseUrl);
  
  const axiosInstance = axios.create({
    baseURL: config.baseUrl,
    timeout: 20000,
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
      Authorization: token,
      'content-type': file ? 'multipart/form-data' : 'application/json',
    },
  });

  // Request interceptor для логирования
  axiosInstance.interceptors.request.use(
    request => {
      console.log('📤 API Request:', request.method?.toUpperCase(), request.url);
      console.log('📤 Full URL:', config.baseUrl + request.url);
      console.log('📤 Request data:', request.data);
      return request;
    },
    error => {
      console.error('❌ Request error:', error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    response => {
      console.log('✅ API Response:', response.status, response.config.url);
      console.log('✅ Response data:', response.data);
      return response;
    },
    error => {
      console.error('❌ API Error:', error.message);
      if (error.response) {
        console.error('❌ Response status:', error.response.status);
        console.error('❌ Response data:', error.response.data);
      } else if (error.request) {
        console.error('❌ No response received');
        console.error('❌ Request:', error.request);
      } else {
        console.error('❌ Error setting up request:', error.message);
      }
      
      if (error.response && error.response.status === 500) {
        throw new Error('Server error');
      }
      if (error.response && error.response.status === 401) {
        // Диспатчим экшен логаута
        console.log(error.response);
        store.dispatch({type: 'LOG_OUT'});

        // Можно также добавить редирект на страницу логина, если нужно
        // navigation.navigate('Login'); // Для этого потребуется передать navigation в apiClient

        // Можно добавить уведомление пользователю
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Session Expired',
          textBody: 'Please log in again',
        });
      }
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export default apiClient;
