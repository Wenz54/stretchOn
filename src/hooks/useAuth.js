import apiClient from '../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import * as yup from 'yup';
import {login} from '../actions/auth';
import SplashScreen from 'react-native-splash-screen';
import { handleErrorResponse } from '../services/utils';

export function useAuth() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const Api = apiClient();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const logged = auth.logged;
  const handleInputChange = (target, value) => {
    setFormData({...formData, [target]: value});
  };

  const validate = async () => {
    let userSchema = yup.object({
      email: yup
        .string()
        .email('Email is not valid')
        .required('Email is required'),
      password: yup
        .string()
        .min(8, 'Password must be at list 8 characters long')
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase letter')
        .matches(/[A-Z]/, 'Password requires an uppercase letter')
        .matches(/[^\w]/, 'Password requires a symbol')
        .matches(/^\S*$/, 'Password must not to contain blank spaces'),
    });
    return await userSchema.validate(formData, {abortEarly: false});
  };

  const handleSubmit = async () => {
    setErrors([]);
    validate()
      .then(() => {
        Api.post('/api/login', formData)
          .then(({data}) => {
            if(data?.success){
              dispatch(login({token:data.token}))
            }
          })
          .catch(e => handleErrorResponse(e,setErrors));
      })
      .catch(e => setErrors(innerToArray(e.inner)));
    
  };

  useEffect(() => {
    if (logged) {
      return navigation.replace('MainStack');
    }
  }, [logged]);

  const innerToArray = (inner) => {
    return inner.map((e)=>({path:e.path, message:e.message}))
  }

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return {formData, errors, handleInputChange, handleSubmit};
}
