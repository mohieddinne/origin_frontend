import * as Actions from "./actions";

const initialState = {
  contacts: [],
  rooms: [],
  openSidebar: false,
  lastRoomId: -341507,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case Actions.SET_ROOMS: {
      const { payload } = action;
      return {
        ...state,
        rooms: payload,
      };
    }
    case Actions.ADD_ROOM: {
      const { payload } = action;
      let lastRoomId = state.lastRoomId;
      if (!payload.id) {
        payload.id = lastRoomId - 1;
        lastRoomId = payload.id;
      }
      return {
        ...state,
        lastRoomId,
        rooms: [payload, ...state.rooms],
      };
    }
    case Actions.UPDATE_ROOM_ID: {
      const { oldId, newID } = action.payload;
      const rooms = state.rooms.map((room) => {
        if (room.id === oldId) return { ...room, id: newID };
        return room;
      });
      return {
        ...state,
        rooms,
      };
    }
    case Actions.ADD_MESSAGE: {
      const { roomId, message } = action.payload;
      const rooms = state.rooms.map((room) => {
        if (room.id === roomId) {
          const messages =
            room.messages.filter((e) => e.id.charAt(0) !== "M") || [];
          messages.push(message);
          return {
            ...room,
            messages,
            lastMessage: message.content,
          };
        }
        return room;
      });
      return {
        ...state,
        rooms,
      };
    }
    case Actions.SET_CONTACTS: {
      const { payload } = action;
      return {
        ...state,
        contacts: payload,
      };
    }
    case Actions.OPEN_SIDEBAR: {
      return {
        ...state,
        openSidebar: true,
      };
    }
    case Actions.CLOSE_SIDEBAR: {
      return {
        ...state,
        openSidebar: false,
      };
    }
    case Actions.TOGGLE_SIDEBAR: {
      return {
        ...state,
        openSidebar: !state.openSidebar,
      };
    }
    case Actions.UPDATE_UNREAD_MESSAGES: {
      const { payload } = action;
      return {
        ...state,
        rooms: state.rooms.map((room) => {
          if (room.id === payload.id) room.unreadMessages = 0;
          return room;
        }),
      };
    }
    case Actions.INCRIMENT_ROOM_UNREAD_MESSAGE: {
      const { payload } = action;
      return {
        ...state,
        rooms: state.rooms.map((room) => {
          if (room.id === payload)
            return {
              ...room,
              unreadMessages: (room.unreadMessages || 0) + 1,
            };
          return room;
        }),
      };
    }
    case Actions.RESET_ROOM_UNREAD_MESSAGE: {
      const { payload } = action;
      return {
        ...state,
        rooms: state.rooms.map((room) => {
          if (room.id === payload)
            return {
              ...room,
              unreadMessages: 0,
            };
          return room;
        }),
      };
    }

    default: {
      return state;
    }
  }
}
export default reducer;
