import * as Actions from "../actions/login.actions";

const initialState = {
  success: false,
  loading: false,
  error: {
    email: null,
    password: null,
  },
};

const login = function (state = initialState, action) {
  switch (action.type) {
    case Actions.LOGIN_SUCCESS: {
      return {
        ...initialState,
        success: true,
      };
    }
    case Actions.LOGIN_ERROR: {
      return {
        success: false,
        error: action.payload,
      };
    }
    case Actions.SET_LOADING: {
      return {
        ...state,
        loading: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default login;
