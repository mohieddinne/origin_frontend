import * as Actions from "./action";
const initialState = {
  data: [],
  searchText: "",
  filters: [],
  filtersData: {},
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
    case Actions.SET_ACTIVITY_LOG: {
      return {
        ...state,
        data: action.payload,
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

    // Update the data
    case Actions.ADD_DATA: {
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    }
    case Actions.SET_FILTERS: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case Actions.SET_FILTER: {
      const { name, value } = action.payload;
      const filters = state.filters;
      const isArray = Array.isArray(value);
      if (
        (!isArray && value) ||
        (isArray &&
          (value.length > 1 || (value.length === 1 && value[0])))
      ) {
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

    case Actions.LOAD_FILTERS: {
      return {
        ...state,
        filtersData: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}
export default reducer;
