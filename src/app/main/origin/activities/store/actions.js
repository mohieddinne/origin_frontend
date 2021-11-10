//Search query
export const SET_SEARCH_WORD = "[ActivityeApp] Set search text";
export const setSearchText = (lettre) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_WORD,
    payload: lettre,
  });
};

// Filters
export const SET_FILTER = "[Activity] Set filter";
export const SET_FILTERS = "[Activity] Set filters";

export const LOAD_FILTERS = "[fldApp] Load filters";
export const SET_BUDGET = "[Activity] Set budget";
export const SET_TOTALSEIZURE = "[Activity] Set totalSeizure";

export function setFilters(name, value) {
  return {
    type: SET_FILTERS,
    payload: { name, value },
  };
}

export function setFilter(payload) {
  return {
    type: SET_FILTER,
    payload,
  };
}
export function loadFilters(payload) {
  return {
    type: LOAD_FILTERS,
    payload,
  };
}
export function Getbudget(payload) {
  return {
    type: SET_BUDGET,
    payload,
  };
}
export function GettotalSeizure(payload) {
  return {
    type: SET_TOTALSEIZURE,
    payload,
  };
}
//Loading
export const SET_LOADING = "SET_LOADING";
export function setLoading(state) {
  return {
    type: SET_LOADING,
    payload: Boolean(state),
  };
}
// Reset
export const RESET_SEARCH_AND_FILTERS = "RESET_SEARCH_AND_FILTERS";
export const RESET_FILTERS = "[fldApp] Reset filter";

export function resetSearchAndFilters() {
  return {
    type: RESET_SEARCH_AND_FILTERS,
  };
}

export function resetFilters() {
  return {
    type: RESET_FILTERS,
  };
}
