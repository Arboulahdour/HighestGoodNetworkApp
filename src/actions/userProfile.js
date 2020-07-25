import axios from "axios";
import {
  getUserProfile as getUserProfileActionCreator,
  editFirstName as editFirstNameActionCreator,
  editUserProfile as editUserProfileActionCreator,
  CLEAR_USER_PROFILE
} from "../constants/userProfile";
import { ENDPOINTS } from "../utils/URL";

export const getUserProfile = userId => {
  const url = ENDPOINTS.USER_PROFILE(userId);
  return async dispatch => {
    const res = await axios.get(url);
    await dispatch(getUserProfileActionCreator(res.data));
  };
};

export const editFirstName = data => dispatch => {
  dispatch(editFirstNameActionCreator(data));
};

export const editUserProfile = data => dispatch => {
  dispatch(editUserProfileActionCreator(data));
};

export const clearUserProfile = () => ({ type: CLEAR_USER_PROFILE });

export const updateUserProfile = (userId, userProfile) => {
  const url = ENDPOINTS.USER_PROFILE(userId);

  return async dispatch => {
    const res = await axios.put(url, userProfile);

    //

    if (res.status === 200) {
      await dispatch(getUserProfileActionCreator(userProfile));
    }
    return res.status;
  };
};
