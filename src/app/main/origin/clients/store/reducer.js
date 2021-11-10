import * as Actions from "./actions";

const initialState = {
  data: [],
  searchText: "",
  options: null,
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
    customerGroups: [],
  },
};

const clientApp = function (state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case Actions.GET_CLIENTS: {
      return {
        ...state,
        data: payload,
      };
    }
    case Actions.GET_CLIENT: {
      return {
        ...state,
        form: {
          ...state.form,
          data: payload,
        },
      };
    }
    case Actions.DELETE_CLIENT: {
      return {
        ...state,
        data: state.data.filter(
          (item) => item.NumeroClient !== payload
        ),
      };
    }
    case Actions.UPDATE_CLIENT: {
      return {
        ...state,
        data: state.data.map((item) => {
          const { NumeroClient, data } = payload;
          if (item.NumeroClient === NumeroClient) {
            return {
              ...item,
              ...data,
            };
          } else {
            return item;
          }
        }),
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
    case Actions.ADD_OR_UPDATE_CLIENT: {
      return {
        ...state,
        data: [...state.data, payload],
      };
    }

    case Actions.SET_SEARCH_WORD: {
      return {
        ...state,
        searchText: payload,
      };
    }

    case Actions.SET_LOADING: {
      return {
        ...state,
        form: {
          ...state.form,
          loading: payload,
        },
      };
    }
    case Actions.SET_OPTIONS: {
      return {
        ...state,
        options: payload,
      };
    }
    case Actions.SET_SELECTED_DATA: {
      return {
        ...state,
        form: { ...state.form, data: payload },
      };
    }
    case Actions.SET_EDITABLE: {
      return {
        ...state,
        form: {
          ...state.form,
          isEditable: payload,
        },
      };
    }
    case Actions.UPDATE_FROM_DATA: {
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data,
            ...payload,
          },
        },
      };
    }
    case Actions.GET_CLIENT_GROUP: {
      return {
        ...state,
        form: {
          ...state.form,
          customerGroups: payload,
        },
      };
    }
    default: {
      return state;
    }
  }
};
export default clientApp;
