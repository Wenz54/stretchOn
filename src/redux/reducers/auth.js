const initialState = {
  logged: false,
  token: null,
  refreshToken: null,
  userData: null,
  last_workout: null,
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,
        logged: true,
        token: action.payload.token,
      };

    case 'LOG_OUT':
      return {
        ...initialState,
      };

    case 'SET_USERDATA':
      return {
        ...state,
        userData: {...state.userData, ...action.payload},
      };
    case 'SET_LAST_WORKOUT':
      return {
        ...state,
        last_workout: action.payload,
      };
    default:
      return state;
  }
};
