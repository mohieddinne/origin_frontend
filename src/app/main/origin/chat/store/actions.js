export const SET_ROOMS = "[ChatApp] Set the chat rooms";
export const ADD_ROOM = "[ChatApp] Add a room";
export const ADD_MESSAGE = "[ChatApp] Add a message";
export const UPDATE_ROOM_ID = "[ChatApp] Update room ID";
export const SET_CONTACTS = "[ChatApp] Set the chat contacts";
export const OPEN_SIDEBAR = "[ChatApp] Open the chat sidebar";
export const CLOSE_SIDEBAR = "[ChatApp] Close the chat sidebar";
export const TOGGLE_SIDEBAR = "[ChatApp] Toggle the chat sidebar";
export const UPDATE_UNREAD_MESSAGES =
  "[ChatApp] update unread messages";
export const INCRIMENT_ROOM_UNREAD_MESSAGE =
  "[ChatApp] Incriment room unread message";
export const RESET_ROOM_UNREAD_MESSAGE =
  "[ChatApp] Reset room unread message";

export function setRooms(rooms) {
  let payload = [];
  if (Array.isArray(rooms)) payload = rooms;
  return {
    type: SET_ROOMS,
    payload,
  };
}

export function addNewRoom(room) {
  const payload = room;
  if (!room) return;
  return {
    type: ADD_ROOM,
    payload,
  };
}

export function addMessage(roomId, message) {
  if (!roomId || !message) return;
  const payload = { roomId, message };
  return {
    type: ADD_MESSAGE,
    payload,
  };
}

export function updateRoomId(oldId, newID) {
  if (!oldId || !newID) return;
  const payload = { oldId, newID };
  return {
    type: UPDATE_ROOM_ID,
    payload,
  };
}

export function setContacts(contacts) {
  let payload = [];
  if (Array.isArray(contacts)) payload = contacts;
  return {
    type: SET_CONTACTS,
    payload,
  };
}

export function ocSidebar(open) {
  return {
    type: open ? OPEN_SIDEBAR : CLOSE_SIDEBAR,
  };
}

export function toggleSidebar() {
  return {
    type: TOGGLE_SIDEBAR,
  };
}

export function updateUnreadMessages(payload) {
  return {
    type: UPDATE_UNREAD_MESSAGES,
    payload,
  };
}

export function incrimentRoomUnreadMessage(roomId) {
  return {
    type: INCRIMENT_ROOM_UNREAD_MESSAGE,
    payload: roomId,
  };
}

export function resetRoomUnreadMessage(roomId) {
  return {
    type: RESET_ROOM_UNREAD_MESSAGE,
    payload: roomId,
  };
}
