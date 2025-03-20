import { SET_USER, REMOVE_USER, SET_ADMIN } from './actionTypes';

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
    default:
      return state;
  }
};

export default userReducer;
