const initialState = {
  modal_visible: false,
};

export const notifications = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        ...state,
        modal_visible: true,
      };
    case 'HIDE_MODAL':
      return {
        ...state,
        modal_visible: false,
      };

    default:
      return state;
  }
};
