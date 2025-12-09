import apiClient from '../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import * as yup from 'yup';
import {login} from '../actions/auth';
import { innerToArray } from './useRegistration';

export function usePersonalData() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const userData = auth.userData;
  const Api = apiClient();
  const FileApi = apiClient(true);
  const [formData, setFormData] = useState({
    email: userData.email,
    name: userData.name,
  });
  const [newAvatat, setNewAvatar] = useState(null);
  const [errors, setErrors] = useState([]);
  const handleInputChange = (target, value) => {
    setFormData({...formData, [target]: value});
  };
  const [status, setStatus]  = useState('')
  const validate = async () => {
    let userSchema = yup.object({
      email: yup
        .string()
        .email('Email is not valid')
        .required('Email is required'),
      name: yup.string().required('Name is required'),
    });
    return await userSchema.validate(formData, {abortEarly: false});
  };

  async function handleLoadUserData() {
    return Api.post('/api/user/me')
      .then(res => {
        dispatch({type: 'SET_USERDATA', payload: {...res?.data.user}});
      })
      .catch(err => {});
  }

  const handleSubmit = async () => {
    setErrors([]);
    validate()
      .then(() => {
        Api.post('/api/user/edit', formData)
          .then(res => {
            handleLoadUserData();
            setStatus(res.data.result);
          })
          .catch(err => {
            setStatus(err.response.data.error);
          });
      })
      .catch(e => setErrors(innerToArray(e.inner)));
  };

  useEffect(() => {
    const file = newAvatat?.assets[0];
    if (file) {
      let partData = new FormData();
      partData.append('avatar', {
        uri: file.uri,
        type: file.type,
        name: file.fileName,
      });
      FileApi.post('/api/user/update-avatar', partData)
        .then(res => {
          setNewAvatar(null);
          handleLoadUserData();
        })
        .catch(err => {
          setNewAvatar(null);
          handleLoadUserData();
          if (err.response?.data?.error) {
            return [
              {url: err?.request._url, message: err.response?.data?.error},
            ];
          } else {
            return [{url: err?.request._url, message: err.message}];
          }
        });
    }
  }, [newAvatat]);
  return {
    setNewAvatar,
    formData,
    userData,
    errors,
    handleInputChange,
    handleSubmit,
    status
  };
}
