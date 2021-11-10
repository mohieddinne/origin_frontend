import { mutate } from "app/services/originServices/groupService";
export const SET_GROUP = "[Groups] Set groups";
export const SET_SEARCH_WORD = "[Groups] Set DT search text";
/// ----
export const DELETE_GROUP = "[Groups] DELETE GROUPE";
export const SET_LOADING = "[Groups] Set GROUPE";
export const DELETE_ITEM = "[Groups] delete row from data";
export const SET_EDITABLE = "[Groups] Set Editable";
export const UPDATE_FORM_DATA = "[Groups] Update form";
export const SET_SUBMITTABLE = "[Groups] Change canSubmit state";
export const ADD_DATA = "[Groups] Add data";
export const UPDATE_DATA = "[Groups] Update data";
export const SET_DATATABLE_SEARCH_TEXT =
  "[Groups] Set DT search text";
export const SET_GROUPS = "[Groups] SET _GROUPS";

export function setGroups(data) {
  return {
    type: SET_GROUPS,
    payload: data,
  };
}

export function setSearchText(lettre) {
  return {
    type: SET_SEARCH_WORD,
    payload: lettre,
  };
}

/// ----

export function setLoading(state) {
  return {
    type: SET_LOADING,
    payload: Boolean(state),
  };
}

export function deleteItem(id) {
  return {
    type: DELETE_GROUP,
    payload: id,
  };
}
// Search -----> exemple

export function setEditable(isEditable) {
  return {
    type: SET_EDITABLE,
    payload: isEditable,
  };
}

export function updateFormData(data) {
  return {
    type: UPDATE_FORM_DATA,
    payload: data,
  };
}
export function setSubmittable(submittable) {
  return {
    type: SET_SUBMITTABLE,
    payload: Boolean(submittable),
  };
}
export function addData(item) {
  return {
    type: ADD_DATA,
    payload: item,
  };
}
export function updateData(item) {
  return {
    type: UPDATE_DATA,
    payload: item,
  };
}

export function submit(data, handleResponse, exit) {
  return (dispatch) => {
    dispatch(setLoading(true));
    const isNew = !data.id;
    mutate(data)
      .then((response) => {
        if (typeof handleResponse === "function")
          handleResponse({ response, isNew, exit });
        if (!data.id) {
          dispatch(addData(response));
        } else {
          dispatch(updateData(response));
        }
        dispatch(setLoading(false));
      })
      .catch((er) => {
        console.error(er);
        if (typeof handleResponse === "function")
          handleResponse({ er, isNew, exit });
        dispatch(setLoading(false));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}
