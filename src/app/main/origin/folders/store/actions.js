import * as foldersSvcs from "app/services/originServices/folderServices";

export const SET_FILTERS = "[fldApp] Set filters";
export const SET_FILTER = "[fldApp] Set a filter";
export const RESET_FILTERS = "[fldApp] Reset filters";
export const RESET_SEARCH_AND_FILTERS =
  "[fldApp] Reset search and filters";
export const LOAD_FILTERS = "[fldApp] Load filters";

export const GET_FOLDERS = "[fldApp] GET FOLDERS";
export const GET_FOLDER = "[fldApp] GET FOLDER";
export const DELETE_FOLDERS = "[fldApp] DELETE FOLDERS";
export const ADD_OR_UPDATE_FOLDER = "[fldApp] Mutate folder";

export const SET_SEARCH_WORD = "[fldApp] Set search text";

export const SET_SELECTED_DATA = "[fldApp] Set Selected Data ";
export const SET_OPTIONS = "[fldApp] Set Selected Data ";
export const SET_EDITABLE = "[fldApp] Set editable";
export const GET_OFFICES = "[fldApp] GET OFFICES";

export const SET_LOADING = "[fldApp] SET_LOADING";
export const QUEUE_LOADING = "[fldApp] Queue loading";
export const DEQUEUE_LOADING = "[fldApp] Dequeue loading";

export function setFilters(filters) {
  return {
    type: SET_FILTERS,
    payload: filters,
  };
}

export function setFilter(name, value) {
  return {
    type: SET_FILTER,
    payload: { name, value },
  };
}

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

export function loadFilters(payload) {
  return {
    type: LOAD_FILTERS,
    payload,
  };
}

export const getFolders = (ids = [], filters, search = "") => {
  return (dispatch) => {
    dispatch(queueLoading());
    foldersSvcs
      .list(ids, search, filters)
      .then(({ data }) => {
        dispatch({
          type: GET_FOLDERS,
          payload: data,
        });
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production")
          console.error(error);
      })
      .finally(() => dispatch(dequeueLoading()));
  };
};

export const getFolder = (ids = [], search = "", filters = []) => {
  return function (dispatch) {
    dispatch(setLoading(true));
    foldersSvcs
      .get(ids, search, filters)
      .then(({ folders, options }) => {
        dispatch(setLoading(false));
        dispatch({
          type: GET_FOLDER,
          payload: folders,
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
};

export function deleteFolder(id) {
  return {
    type: DELETE_FOLDERS,
    payload: id,
  };
}

export function setLoading(state) {
  return {
    type: SET_LOADING,
    payload: Boolean(state),
  };
}

export function queueLoading() {
  return {
    type: QUEUE_LOADING,
  };
}

export function dequeueLoading() {
  return {
    type: DEQUEUE_LOADING,
  };
}

export function submit(data, handleResponse, exit) {
  return (dispatch) => {
    const isNew = false;
    dispatch(setLoading(true));
    foldersSvcs
      .mutate(data)
      .then((response) => {
        if (typeof handleResponse === "function")
          handleResponse({ response, isNew, exit });
        dispatch(setEditable(false));
        dispatch({
          type: ADD_OR_UPDATE_FOLDER,
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

// Add Data to form DAta
export function setSelectedData(payload) {
  return {
    type: SET_SELECTED_DATA,
    payload,
  };
}

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

// Get Folder Office
export function getOffices(ids = []) {
  return (dispatch) => {
    // dispatch(setLoading(true));
    foldersSvcs
      .Offices(ids)
      .then((data) => {
        dispatch(setLoading(false));
        dispatch({
          type: GET_OFFICES,
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
