import apiClient from '../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import {handleErrorResponse} from '../services/utils';
import {login} from '../actions/auth';
YupPassword(yup);

export function useRegistration() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const Api = apiClient();
  const auth = useSelector(state => state.auth);
  const logged = auth.logged;
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    code: '',
    password: '',
    confirmed_password: '',
  });
  const [errors, setErrors] = useState([]);
  const [step, setStep] = useState(0);
  const handleInputChange = (target, value) => {
    setFormData({...formData, [target]: value});
  };

  const validate = async () => {
    let userSchema;
    switch (step) {
      case 0:
        userSchema = yup.object({
          email: yup
            .string()
            .email('Email is not valid')
            .required('Email is required'),
          name: yup.string().required('Username is required'),
          promocode: yup.string(),
          password: yup
            .string()
            .min(8, 'Password must be at list 8 characters long')
            .matches(/[0-9]/, 'Password requires a number')
            .matches(/[a-z]/, 'Password requires a lowercase letter')
            .matches(/[A-Z]/, 'Password requires an uppercase letter')
            .matches(/[^\w]/, 'Password requires a symbol')
            .matches(/^\S*$/, 'Password must not to contain blank spaces'),
          confirmed_password: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match'),
        });
        return await userSchema.validate(formData, {abortEarly: false});
      case 1:
        userSchema = yup.object({
          code: yup
            .string()
            .required('Code is required')
            .matches(/^[0-9]+$/, 'Code must contain only digits')
            .min(4, 'Code must be exactly 4 digits'),
        });
        return await userSchema.validate(formData, {abortEarly: false});
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    console.log('🚀 Registration handleSubmit called, step:', step);
    console.log('📝 Form data:', formData);
    console.log('🌐 API Base URL:', Api.defaults.baseURL);
    console.log('📡 Full URL will be:', Api.defaults.baseURL + '/api/registration/start');
    setErrors([]);
    validate()
      .then(() => {
        console.log('✅ Validation passed');
        switch (step) {
          case 0:
            console.log('📤 Sending registration/start request...');
            console.log('📤 Request URL:', Api.defaults.baseURL + '/api/registration/start');
            console.log('📤 Request data:', formData);
            return Api.post('/api/registration/start', formData)
              .then(res => {
                console.log('✅ Registration start success:', res.data);
                setStep(step + 1);
              })
              .catch(e => {
                console.error('❌ Registration start error:', e);
                console.error('Error response:', e.response?.data);
                handleErrorResponse(e, setErrors);
              });
          case 1:
            console.log('📤 Sending registration/end request...');
            return Api.post('/api/registration/end', formData)
              .then(res => {
                console.log('✅ Registration end success:', res.data);
                if (res.data?.success && res.data?.token) {
                  console.log('✅ Auto-login after registration with token');
                  dispatch(login({token: res.data.token}));
                }
              })
              .catch(e => {
                console.error('❌ Registration end error:', e);
                console.error('Error response:', e.response?.data);
                handleErrorResponse(e, setErrors);
              });
          default:
            return;
        }
      })
      .catch(e => {
        console.error('❌ Validation error:', e);
        setErrors(innerToArray(e.inner));
      });
  };
  const stepBack = () => {
    setStep(0);
  };

  // Navigate to main screen after successful login
  useEffect(() => {
    if (logged) {
      console.log('✅ User logged in, navigating to MainStack');
      navigation.replace('MainStack');
    }
  }, [logged]);

  return {step, formData, errors, stepBack, handleInputChange, handleSubmit};
}

export const innerToArray = (inner) => {
  return inner.map((e)=>({path:e.path, message:e.message}))
}