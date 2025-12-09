import apiClient from '../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

export function useNotifications() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const logged = auth.logged;
  const [notifications, setNotifications] = useState([]);
  const Api = apiClient();

  const [errors, setErrors] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  async function handleLoadNotifications() {
    return Api.get('/api/notification/get-notifications')
      .then(({data}) => {
        if (data.success) {
          setNotifications(data.result.notifications);
        }
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
    let errs = await handleLoadNotifications();
    setErrors(errs);
    setRefreshing(false);
    setIsFirstLoad(false)
  }

  function handleRead(id) {
    return Api.post(`/api/notification/read-notifications`, {
      ids: [id],
    })
      .then(response => {setNotifications(notifications.filter(n => n.id !== id));})
      .catch(err => {
        if (err.response?.data?.error) {
          return [{url: err?.request._url, message: err.response?.data?.error}];
        } else {
          return [{url: err?.request._url, message: err.message}];
        }
      });
  }

  function handleReadAll() {
    return Api.post('/api/notification/read-notifications',{})
      .then((response) => {
        setNotifications([]);
      })
      .catch(err => {
        if (err.response?.data?.error) {
          return [{url: err?.request._url, message: err.response?.data?.error}];
        } else {
          return [{url: err?.request._url, message: err.message}];
        }
      });
  }

  useEffect(() => {
    if (!logged) {
      return navigation.replace('Login');
    }
  }, [logged]);

  useEffect(() => {
    handleRefresh();
  }, []);

  return {
    refreshing,
    errors,
    notifications,
    handleRefresh,
    handleReadAll,
    handleRead,
    isFirstLoad
  };
}
