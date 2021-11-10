export const SET_DATA = "[NavMenu-ADMIN] SET DATA";
export const REFETCH = "[NavMenu-ADMIN] Refetch the data";

export const UPDATE_DATA = "[NavMenu-ADMIN] UPDATE DATA BULK";

export const CREATE_ITEM = "[NavMenu-ADMIN] CREATE ITEM";

export const EDIT_ITEM = "[NavMenu-ADMIN] EDIT ITEM";
export const ADD_ITEM = "[NavMenu-ADMIN] ADD ITEM";
export const UPDATE_ITEM = "[NavMenu-ADMIN] UPDATE ITEM";
export const DELETE_ITEM = "[NavMenu-ADMIN] DELETE ITEM";

export const CLOSE_CREATING_DIALOG = "[NavMenu-ADMIN] CLOSE DIALOG";
export const SYNC_SERVER = "[NavMenu-ADMIN] UPDATE SYNCing STATUS";
export const RESET_APP = "[NavMenu-ADMIN] RESET APP";

// Put the mnu data in Redux
export function setData(data) {
  if (!data) data = [];
  return {
    type: SET_DATA,
    payload: data,
  };
}

export function doRefetch(doRefetch) {
  return {
    type: REFETCH,
    payload: doRefetch,
  };
}

// Update the mnu data in Redux
export function updateData(data) {
  if (!data) data = [];
  return {
    type: UPDATE_DATA,
    payload: data,
  };
}

// Push item to EditableItem
export function editItem(element) {
  return {
    type: EDIT_ITEM,
    payload: element || null,
  };
}

// Update or create an item
export function updateItem(element) {
  if (!element) return false;
  let type = ADD_ITEM;
  if (element.id) type = UPDATE_ITEM;
  return {
    type,
    payload: element,
  };
}

// Deleting item of the menu
export function deleteItem(element) {
  if (!element) return false;
  return {
    type: DELETE_ITEM,
    payload: element,
  };
}

// Change the status of the sync server
export function syncServer(state) {
  const payload = !!state;
  return {
    type: SYNC_SERVER,
    payload,
  };
}
