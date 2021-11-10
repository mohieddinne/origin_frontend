import { setUserData } from "./user.actions";
import * as NavigationActs from "app/store/actions/fuse/navigation.actions";

export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const SET_LOADING = "SET LOADING";

export function setLoading(state) {
  return {
    type: SET_LOADING,
    payload: Boolean(state),
  };
}

export function loginSuccess(user) {
  return (dispatch) => {
    dispatch(setUserData(user));
    dispatch(NavigationActs.resetNavigation());
    return dispatch({
      type: LOGIN_SUCCESS,
    });
  };
}