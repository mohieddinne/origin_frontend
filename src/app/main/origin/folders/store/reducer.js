import * as Actions from "./actions";

// const [date_start, date_end] = getDefaultDates();
const initialState = {
  data: [],
  searchText: "",
  options: null,
  loading: 0,
  filters: {},
  filtersData: {},
  form: {
    data: null,
    canSubmit: true,
    isSaved: false,
    loading: false,
    isNew: true,
    isEditable: false,
    offices: [],
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case Actions.GET_FOLDERS: {
      return {
        ...state,
        data: payload,
      };
    }
    case Actions.GET_FOLDER: {
      return {
        ...state,
        form: { ...state.form, data: payload ? payload[0] : null },
      };
    }
    case Actions.QUEUE_LOADING: {
      return {
        ...state,
        loading: state.loading + 1,
      };
    }
    case Actions.DEQUEUE_LOADING: {
      let loading = state.loading;
      if (loading > 0) loading--;
      else if (loading <= 0) loading = 0;
      return {
        ...state,
        loading,
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
    case Actions.DELETE_FOLDERS: {
      return {
        ...state,
        data: [
          ...state.data.filter(
            (item) => item.NumeroDossier !== payload
          ),
        ],
      };
    }

    case Actions.ADD_OR_UPDATE_FOLDER: {
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, ...payload },
        },
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
    case Actions.GET_OFFICES: {
      return {
        ...state,
        form: {
          ...state.form,
          offices: payload,
        },
      };
    }

    default: {
      return state;
    }
  }
}
