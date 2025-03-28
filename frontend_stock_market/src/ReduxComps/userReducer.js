import { SET_USER, REMOVE_USER, SET_ADMIN, REMOVE_ADMIN } from './actionTypes';

const initialState = {
  user: null,
  admin: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload
      };
    case REMOVE_USER:
      localStorage.removeItem('user');
      return {
        ...state,
        user: null
      };
    case SET_ADMIN:
      localStorage.setItem('admin', JSON.stringify(action.payload));
      return {
        ...state,
        admin: action.payload
      };
    case REMOVE_ADMIN:
      localStorage.removeItem('admin');
      return {
        ...state,
        admin: null
      };
    default:
      return state;
  }
};

export default userReducer;
