import { SET_USER, REMOVE_USER, SET_ADMIN, REMOVE_ADMIN } from './actionTypes';

const initialState = {
  user: null,
  admin: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case REMOVE_USER:
      return {
        ...state,
        user: null
      };
    case SET_ADMIN:
      return {
        ...state,
        admin: action.payload
      };
    case REMOVE_ADMIN:
      return {
        ...state,
        admin: null
      };
    default:
      return state;
  }
};

export default userReducer;
