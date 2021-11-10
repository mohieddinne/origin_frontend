import * as Actions from "./actions";

const initialState = {
  data: [],
  searchText: "",
  options: null,
  loading: false,
  filters: {},
  filtersData: {},
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
    case Actions.GET_FACTURES: {
      return {
        ...state,
        data: action.payload,
      };
    }
    case Actions.DELETE_FACTURE: {
      return {
        ...state,
        data: state.data.filter(
          (facture) => facture.NumeroFacture !== action.payload
        ),
      };
    }
    case Actions.ADD_OR_UPDATE_FACTURE: {
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    }
    case Actions.SET_SEARCH_WORD: {
      return {
        ...state,
        searchText: action.payload,
      };
    }
    case Actions.SET_SELECTED_DATA: {
      return {
        ...state,
        form: { ...state.form, data: action.payload },
      };
    }
    case Actions.SET_FILTERS: {
      const { name, value, force } = action.payload;
      let filters = state.filters;
      if (force === true) {
        filters = { [name]: value };
      } else {
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
    case Actions.SET_OPTIONS: {
      return {
        ...state,
        options: action.payload,
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
}

export default reducer;
