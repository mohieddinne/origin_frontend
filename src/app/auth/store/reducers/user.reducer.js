import * as Actions from "../actions/user.actions";

const initialState = {
  role: "", //guest
  data: {
    displayName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    expert: false,
    roleName: "Administrateur",
    photoURL: "assets/images/avatars/Velazquez.jpg",
    email: "johndoe@tekru.net",
    shortcuts: [],
  },
};

const user = function (state = initialState, action) {
  switch (action.type) {
    case Actions.SET_USER_DATA: {
      return {
        ...initialState,
        ...action.payload,
      };
    }
    case Actions.UPDATE_USER_DATA: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
      };
    }
    case Actions.REMOVE_USER_DATA: {
      return {
        ...initialState,
      };
    }
    case Actions.USER_LOGGED_OUT: {
      return initialState;
    }
    case Actions.UPDATE_USER_ACCESSES: {
      return {
        ...state,
        role: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default user;
