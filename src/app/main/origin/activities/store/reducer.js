import * as Actions from "./actions";

const initialState = {
  data: [],
  searchText: "",
  options: null,
  loading: false,
  filters: {},
  filtersData: {},
  budget: 0,
  totalSeizure: 0,
  form: {
    data: null,
    isNew: true,
    canSubmit: true,
    loading: false,
    categoryArray: null,
    supplierArray: null,
    isEditable: false,
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
    case Actions.SET_BUDGET: {
      return {
        ...state,
        budget: action.payload,
      };
    }
    case Actions.SET_TOTALSEIZURE: {
      return {
        ...state,
        totalSeizure: action.payload,
      };
    }
    case Actions.SET_FILTERS: {
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
    case Actions.SET_FILTER: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case Actions.RESET_FILTERS: {
      const { payload } = action;
      return {
        ...state,
        filters: !payload
          ? { Responsable: state.filters.Responsable }
          : {},
      };
    }
    case Actions.RESET_SEARCH_AND_FILTERS: {
      return {
        ...state,
        filters: {},
        searchText: "",
      };
    }
    case Actions.LOAD_FILTERS: {
      return {
        ...state,
        filtersData: action.payload,
      };
    }
    case Actions.SET_LOADING: {
      return {
        ...state,
        form: {
          ...state.form,
          loading: action.payload,
        },
      };
    }

    default: {
      return state;
    }
  }
}

export default reducer;
