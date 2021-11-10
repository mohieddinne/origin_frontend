import {
  get,
  list,
  mutate,
  groups,
} from "app/services/originServices/clientService";

export const GET_CLIENTS = "[clientApp] GET CLIENTS";
export const GET_CLIENT = "[clientApp] GET CLIENT";
export const DELETE_CLIENT = "[clientApp]  DELETE_CLIENT";
export const UPDATE_CLIENT = "[clientApp]  Update client";
export const ADD_OR_UPDATE_CLIENT =
  "[clientApp] ADD  OR UPDATE CLIENT";
export const SET_SEARCH_WORD = "[clientApp] Set search text";
export const SET_SELECTED_DATA = "[clientApp] Set Selected Data ";
export const SEARCH_LETTRE = "[clientApp] SEARCH LETTRE ";
export const FILTER = "[clientApp] FILTER ";
export const SET_LOADING = "[clientApp] Set loading";
export const SET_EDITABLE = "[clientApp] Set editable";
export const UPDATE_FROM_DATA = "[clientApp] Update form data";
export const SET_OPTIONS = "[clientApp] Set options";
export const SET_FILTERS = "[clientApp] Set filters";
export const LOAD_FILTERS = "[clientApp] Load filters";
export const GET_CLIENT_GROUP = "[clientApp] get Client Group";
export const RESET_FILTERS = "[clientApp] Reset filters";
export const RESET_SEARCH_AND_FILTERS =
  "[clientApp] Reset search and filters";

export function setFilters(name, value) {
  return {
    type: SET_FILTERS,
    payload: { name, value },
  };
}

export function loadFilters(payload) {
  return {
    type: LOAD_FILTERS,
    payload,
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

export function getClients(ids = [], search = "") {
  return (dispatch, getState) => {
    const { clientApp } = getState();
    dispatch(setLoading(true));
    list(ids, search, clientApp.filters)
      .then(({ clients, options }) => {
        dispatch(setLoading(false));
        dispatch({
          type: GET_CLIENTS,
          payload: clients,
        });
        dispatch({
          type: SET_OPTIONS,
          payload: options,
        });
      })
      .catch((error) => {
        dispatch(setLoading(false));
        if (process.env.NODE_ENV !== "production")
          console.error(error);
      });
  };
}

export function getClient(ids = [], search = "", filters = []) {
  return (dispatch) => {
    dispatch(setLoading(true));
    get(ids, search, filters)
      .then(({ clients, options }) => {
        dispatch(setLoading(false));
        dispatch({
          type: GET_CLIENT,
          payload: (clients || [])[0],
        });
        dispatch({
          type: SET_OPTIONS,
          payload: options,
        });
      })
      .catch((error) => {
        dispatch(setLoading(false));
        if (process.env.NODE_ENV !== "production")
          console.error(error);
      });
  };
}

//Get Client Team
export function getClientGroup(ids = []) {
  return (dispatch) => {
    // dispatch(setLoading(true));
    groups(ids)
      .then((data) => {
        dispatch(setLoading(false));
        dispatch({
          type: GET_CLIENT_GROUP,
          payload: data,
        });
      })
      .catch((error) => {
        //  dispatch(setLoading(false));
        if (process.env.NODE_ENV !== "production")
          console.error(error);
      });
  };
}

export function deleteClient(id) {
  return {
    type: DELETE_CLIENT,
    payload: id,
  };
}

export function setLoading(state) {
  return {
    type: SET_LOADING,
    payload: Boolean(state),
  };
}

export function setOptions(payload) {
  return {
    type: SET_OPTIONS,
    payload,
  };
}

export function updateClient(data, NumeroClient) {
  return {
    type: UPDATE_CLIENT,
    payload: {
      data,
      NumeroClient,
    },
  };
}

// Create or update a client
export function submit(rawData, handleResponse, exit) {
  const data = {
    ...rawData,
    groupId: parseInt(rawData.groupId),
  };
  return (dispatch) => {
    const isNew = false;
    dispatch(setLoading(true));
    mutate(data)
      .then((response) => {
        if (typeof handleResponse === "function")
          handleResponse({ response, isNew, exit });
        dispatch(updateFormDate(response));
        dispatch(setEditable(false));
        dispatch({
          type: ADD_OR_UPDATE_CLIENT,
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

export function updateFormDate(payload) {
  return {
    type: UPDATE_FROM_DATA,
    payload,
  };
}

// Add data to form DAta
export const setSelectedData = (selectedData) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_DATA,
    payload: selectedData,
  });
};

// Search -----> exemple
export const setSearchText = (lettre) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_WORD,
    payload: lettre,
  });
};

export function setEditable(isEditable) {
  return {
    type: SET_EDITABLE,
    payload: Boolean(isEditable),
  };
}
