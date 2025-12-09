import {combineReducers} from 'redux';
import {auth} from './auth';
import {notifications} from './notifications';

const appReducer = combineReducers({
  auth,
  notifications,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
