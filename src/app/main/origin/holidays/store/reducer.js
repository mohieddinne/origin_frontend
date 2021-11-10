import * as Actions from "./action";

const initialState = {
  searchText: "",
  filters: {},
  form: {
    data: null,
    isNew: true,
    canSubmit: true,
    loading: false,
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case Actions.SET_SEARCH_WORD: {
      return {
        ...state,
        searchText: action.payload,
      };
    }
    case Actions.SET_SUBMITTABLE: {
      return {
        ...state,
        form: {
          ...state.form,
          canSubmit: action.payload,
        },
      };
    }
    case Actions.SET_FILTER: {
      const { name, value } = action.payload;
      const filters = state.filters;
      if (value) {
        filters[name] = value;
      } else {
        delete filters[name];
      }
      return {
        ...state,
        filters: { ...filters },
      };
    }
    case Actions.RESET_FILTERS: {
      return {
        ...state,
        filters: {},
      };
    }
    default: {
      return state;
    }
  }
}
export default reducer;
