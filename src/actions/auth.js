import apiClient from '../services/api';
import config from '../config';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';

export function subscribe_device(data) {
  return apiClient()
    .post('/sra_notifications', data)
    .catch(err => {
      console.log(err);
    });
}

export function logout() {
  return dispatch => {
    dispatch({type: 'LOG_OUT'});
  };
}

export function login(data) {
  return dispatch => {
    dispatch({type: 'LOG_IN',payload:data});

  };
}

export function last_workout(data) {
  return dispatch => {
    dispatch({type: 'SET_LAST_WORKOUT',payload:data});

  };
}
