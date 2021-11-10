export const SET_SEARCH_WORD = "[Holidays] Set holidays search text";
export const SET_FILTER = "[Holidays] Set filter";
export const RESET_FILTERS = "[Holidays] Reset filter";
export const SET_SUBMITTABLE = "[Holidays] Set submittable";

export function setSearchText(keyword) {
  return {
    type: SET_SEARCH_WORD,
    payload: keyword,
  };
}

export function setSubmittable(submittable) {
  return {
    type: SET_SUBMITTABLE,
    payload: Boolean(submittable),
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
