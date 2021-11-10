import * as Actions from "./actions";

const date_start = null;
const date_end = null;
const initialState = {
  widgets: [
    [
      {
        data: null,
        image: "",
      },
    ],
  ],
  widgetsReadiness: [0],
  loading: 0,
  dataTable: {
    data: [],
    searchText: "",
  },
  filters: [
    {
      date_start,
      date_end,
    },
  ],
  math: ["income"],
  filtersData: {},
  reportFilter: {},
  selectedEmployee: null,
};

function reducer(state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case Actions.QUEUE_LOADING: {
      return {
        ...state,
        loading: state.loading + 1,
      };
    }

    case Actions.SET_REPORT_FILTER: {
      return {
        ...state,
        reportFilter: payload,
      };
    }

    case Actions.DEQUEUE_LOADING: {
      return {
        ...state,
        loading: state.loading - 1,
      };
    }
    case Actions.LOAD_FILTERS: {
      return {
        ...state,
        filtersData: action.payload,
      };
    }
    case Actions.ADD_PLAYGROUND: {
      return {
        ...state,
        filters: [
          ...state.filters,
          {
            date_start,
            date_end,
          },
        ],
        math: [...state.math, "income"],
        widgets: [...state.widgets, []],
        widgetsReadiness: [...state.widgetsReadiness, 0],
      };
    }

    case Actions.SET_DATATABLE_SEARCH_TEXT: {
      return {
        ...state,
        dataTable: {
          ...state.dataTable,
          searchText: payload,
        },
      };
    }
    case Actions.REMOVE_PLAYGROUND: {
      return {
        ...state,
        filters: state.filters.filter(
          (i, key) => key !== action.payload
        ),
        math: state.math.filter((i, key) => key !== action.payload),
      };
    }
    case Actions.SET_MATH: {
      const { value, index } = action.payload;
      return {
        ...state,
        math: state.math.map((item, key) =>
          key === index ? value : item
        ),
      };
    }
    case Actions.SET_FILTERS: {
      const { name, value, index } = action.payload;
      return {
        ...state,
        filters: state.filters.map((item, key) => {
          if (key === index) {
            return {
              ...item,
              [name]: value,
            };
          } else {
            return item;
          }
        }),
      };
    }
    case Actions.RESET_FILTERS: {
      const index = action.payload;
      return {
        ...state,
        filters: state.filters.map((item, key) => {
          if (key === index) {
            return initialState.filters[0];
          } else {
            return item;
          }
        }),
      };
    }
    case Actions.SET_TABLE_DATA: {
      return {
        ...state,
        dataTable: action.payload,
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
    case Actions.SET_SELECTED_EMPLOYEE: {
      return {
        ...state,
        selectedEmployee: payload,
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
