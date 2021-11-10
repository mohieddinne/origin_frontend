import * as kpisSrvs from "app/services/originServices/kpis.service";

export const QUEUE_LOADING = "[KPIs] Queue loading";
export const DEQUEUE_LOADING = "[KPIs] Dequeue loading";
export const SET_MATH = "[KPIs] Set math algorithm";
export const SET_FILTERS = "[KPIs] Set filters";
export const RESET_FILTERS = "[KPIs] Reset filters";
export const LOAD_FILTERS = "[KPIs] Load filters";
export const ADD_PLAYGROUND = "[KPIs] Add a playground";
export const REMOVE_PLAYGROUND = "[KPIs] Remove a playground";
export const SET_TABLE_DATA = "[fldApp] Set table data";
export const SET_LOADING = "[KPIs] SET_LOADING";
export const SET_DATATABLE_SEARCH_TEXT = "[KPIs] Set DT search text";
export const SET_EDITABLE = "[KPIs] Set editable";
export const SET_REPORT_FILTER = "[KPIs] Set report filter";
export const SET_SELECTED_EMPLOYEE = "[KPIs] Set selected employee";

export function setEditable(isEditable) {
  return {
    type: SET_EDITABLE,
    payload: Boolean(isEditable),
  };
}

export function queueLoading() {
  return {
    type: QUEUE_LOADING,
    payload: 1,
  };
}

export function dequeueLoading() {
  return {
    type: DEQUEUE_LOADING,
    payload: 1,
  };
}

export function setFilters(name, value, index) {
  return {
    type: SET_FILTERS,
    payload: { name, value, index },
  };
}

export function resetFilters(index) {
  return {
    type: RESET_FILTERS,
    payload: index,
  };
}

export function setMath(value, index) {
  return {
    type: SET_MATH,
    payload: { value, index },
  };
}

export function addPlayground() {
  return {
    type: ADD_PLAYGROUND,
  };
}

export function removePlayground(key) {
  return {
    type: REMOVE_PLAYGROUND,
    payload: key,
  };
}

export function loadFilters() {
  return (dispatch, getState) => {
    const { kpisApp } = getState();
    if (Object.keys(kpisApp.filtersData).length > 0) return;
    dispatch(queueLoading());
    kpisSrvs
      .filters()
      .then((response) => {
        const data = {};
        for (const item of response) {
          data[item.name] = item.data;
        }

        dispatch({
          type: LOAD_FILTERS,
          payload: data,
        });
        dispatch(dequeueLoading());
      })
      .catch((error) => {
        dispatch(dequeueLoading());
      });
  };
}

export function setTableData(data) {
  return {
    type: SET_TABLE_DATA,
    payload: data,
  };
}
export function setLoading(state) {
  return {
    type: SET_LOADING,
    payload: Boolean(state),
  };
}

export function setDatatableSearchText(words) {
  return {
    type: SET_DATATABLE_SEARCH_TEXT,
    payload: words,
  };
}

export function setReportFilter(payload) {
  return {
    type: SET_REPORT_FILTER,
    payload,
  };
}

export function setSelectedEmployee(payload) {
  return {
    type: SET_SELECTED_EMPLOYEE,
    payload,
  };
}
