export const SET_ACTIVITY_LOG = "[Activity_log] Set Activity_log";
export const SET_SEARCH_WORD = "[Activity_log] Set  search text";
export const ADD_DATA = "[Activity_log] Add data";
export const LOAD_FILTERS = "[Activity_log] Load filters";
export const SET_FILTERS = "[Activity_log] Set filters";
export const SET_FILTER = "[Activity_log] Set a filter";
export const RESET_FILTERS = "[Activity_log] Reset filters";

/// ----

//export const SET_GROUPS = "[Groups] SET _GROUPS";

export function setActvity(data) {
  return {
    type: SET_ACTIVITY_LOG,
    payload: data,
  };
}
export function loadFilters(payload) {
  return {
    type: LOAD_FILTERS,
    payload,
  };
}
export function setFilter(name, value) {
  return {
    type: SET_FILTER,
    payload: { name, value },
  };
}
export function resetFilters() {
  return {
    type: RESET_FILTERS,
  };
}
export function setFilters(filters) {
  return {
    type: SET_FILTERS,
    payload: filters,
  };
}
export function setSearchText(lettre) {
  return {
    type: SET_SEARCH_WORD,
    payload: lettre,
  };
}
export function addData(item) {
  return {
    type: ADD_DATA,
    payload: item,
  };
}

/// ----
