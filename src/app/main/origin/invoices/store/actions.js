import { FactureService } from "app/services/originServices";

export const GET_FACTURES = "[invoiceApp] GET FACTURES";
export const DELETE_FACTURE = "[invoiceApp] DELETE ITEM";
export const UPDATE_FACTURE = "[invoiceApp] UPDATE ITEM";
export const ADD_OR_UPDATE_FACTURE = "[invoiceApp] ADD FACTURE";
export const SET_SEARCH_WORD = "[invoiceApp] Set search text";
export const SET_SELECTED_DATA = "[invoiceApp] Set Selected Data ";
export const SET_LOADING = "[invoiceApp] Set loading";
export const SET_OPTIONS = "[invoiceApp] Set options";
export const SET_FILTERS = "[invoiceApp] Set filters";
export const RESET_FILTERS = "[invoiceApp] Reset filters";
export const RESET_SEARCH_AND_FILTERS =
  "[invoiceApp] Reset search and filters";
export const LOAD_FILTERS = "[invoiceApp] Load filters";

export function getFactures(ids = [], search = "", filters = []) {
  return (dispatch) => {
    dispatch(setLoading(true));
    FactureService.get(ids, search, filters)
      .then(({ factures, options }) => {
        dispatch({
          type: GET_FACTURES,
          payload: factures,
        });
        dispatch({
          type: SET_OPTIONS,
          payload: options,
        });
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production")
          console.error(error);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

export function setFilters(name, value, force = false) {
  return {
    type: SET_FILTERS,
    payload: { name, value, force },
  };
}

export function resetFilters() {
  return {
    type: RESET_FILTERS,
  };
}

export function resetSearchAndFilters() {
  return {
    type: RESET_SEARCH_AND_FILTERS,
  };
}

export function loadFilters(payload) {
  return {
    type: LOAD_FILTERS,
    payload,
  };
}

export function deleteFacture(id) {
  return {
    type: DELETE_FACTURE,
    payload: id,
  };
}
export function setLoading(state) {
  return {
    type: SET_LOADING,
    payload: Boolean(state),
  };
}

// Add || Update   Facture

export function submit(data, handleResponse, exit) {
  if (data.MontantFacture)
    data.MontantFacture = parseInt(data.MontantFacture);
  if (data.HeuresExpert)
    data.HeuresExpert = parseInt(data.HeuresExpert);
  let isNew = true;
  if (data.id) {
    isNew = false;
    data.NumeroFacture = data.id;
  }
  if (!data.id) {
    isNew = true;
  }
  delete data.id;

  return (dispatch) => {
    dispatch(setLoading(true));
    FactureService.mutate(data)
      .then((response) => {
        if (typeof handleResponse === "function")
          handleResponse({ response, isNew, exit });
        dispatch({
          type: ADD_OR_UPDATE_FACTURE,
          payload: data,
        });
        dispatch(setLoading(false));
      })
      .catch((error) => {
        if (typeof handleResponse === "function")
          handleResponse({ error, isNew, exit });
        dispatch(setLoading(false));
        if (process.env.NODE_ENV !== "production")
          console.error(error);
      });
  };
}
//Add Data to form DAta
export const setSelectedData = (selectedData) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_DATA,
    payload: selectedData,
  });
};

//Search
export const setSearchText = (lettre) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_WORD,
    payload: lettre,
  });
};
