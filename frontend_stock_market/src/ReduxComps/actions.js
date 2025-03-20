import { SET_USER, REMOVE_USER, SET_ADMIN } from './actionTypes';

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};

export const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

export const setAdmin = (admin) => {
  return {
    type: SET_ADMIN,
    payload: admin
  };
};
