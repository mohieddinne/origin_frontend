import * as Actions from "./action";

const initialState = {
  data: [],
  searchText: "",
  form: {
    data: null,
    isNew: true,
    canSubmit: true,
    loading: false,
    isEditable: false,
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case Actions.SET_GROUPS: {
      return {
        ...state,
        data: action.payload,
      };
    }
    case Actions.DELETE_GROUP: {
      return {
        ...state,
        data: state.data.filter((item) => item.id !== action.payload),
      };
    }
    //[...state.data,action.payload]
    case Actions.SET_SEARCH_WORD: {
      return {
        ...state,
        searchText: action.payload,
      };
    }
    /// ----

    case Actions.SET_LOADING: {
      return {
        ...state,
        form: {
          ...state.form,
          loading: action.payload,
        },
      };
    }

    case Actions.SET_EDITABLE: {
      return {
        ...state,
        form: {
          ...state.form,
          isEditable: action.payload,
        },
      };
    }
    // Update the data
    case Actions.ADD_DATA: {
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    }
    case Actions.UPDATE_FORM_DATA: {
      const { payload } = action;
      // Reset if no data is given
      if (!payload) {
        return {
          ...state,
          form: {
            ...state.form,
            data: null,
            isNew: true,
            isEditable: true,
          },
        };
      }

      // let isNew = true;
      // if (payload.id) {
      //   isNew = !Number.isInteger(parseInt(payload.id));
      // } else if (state.form.data && state.form.data.id) {
      //   isNew = false;
      // }
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...payload,
            id: parseInt(payload.id),
          },
          isNew: true,
        },
      };
    }

    case Actions.UPDATE_DATA: {
      return {
        ...state,
        data: state.data.map((item) =>
          action.payload.id === item.id
            ? { clientCount: item.clientCount, ...action.payload }
            : item
        ),
      };
    }

    default: {
      return state;
    }
  }
}
export default reducer;
