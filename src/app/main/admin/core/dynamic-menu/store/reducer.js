import * as Actions from "./actions";
import * as Hlprs from "./helpers";

const initialState = {
  data: null,
  editableItem: null,
  createDialog: false,
  deletedItems: [],
  lastId: 0,
  synced: true,
  categoryDialog: false,
  doRefetch: false,
};

const navMenuAdminReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.SET_DATA: {
      return {
        ...state,
        data: action.payload,
      };
    }
    case Actions.REFETCH: {
      return {
        ...state,
        doRefetch: action.payload,
      };
    }
    case Actions.UPDATE_DATA: {
      return {
        ...state,
        synced: false,
        data: action.payload,
      };
    }

    case Actions.CREATE_ITEM: {
      return {
        ...state,
        createDialog: true,
      };
    }
    case Actions.CLOSE_CREATING_DIALOG: {
      return {
        ...state,
        createDialog: false,
      };
    }

    case Actions.EDIT_ITEM: {
      let editableItem = null;
      if (action.payload)
        editableItem = Hlprs.rolesToEditor(action.payload);
      return {
        ...state,
        editableItem,
      };
    }
    case Actions.ADD_ITEM: {
      const item = {
        ...action.payload,
        isNewItem: true,
        id: state.lastId - 1,
      };
      return {
        ...state,
        lastId: state.lastId - 1,
        synced: false,
        editableItem: Hlprs.rolesToEditor(item),
        data: [...state.data, item],
        createDialog: false,
      };
    }
    case Actions.UPDATE_ITEM: {
      const item = Hlprs.rolesToRedux({ ...action.payload });
      const data = Hlprs.treeHandling(state.data, (element) => {
        if (element?.id === item?.id) return { ...element, ...item };
        return element;
      });
      return {
        ...state,
        synced: false,
        data,
      };
    }
    case Actions.DELETE_ITEM: {
      const item = { ...action.payload };
      const data = Hlprs.treeHandling(
        state.data,
        (element) => element.id !== item.id,
        "filter"
      );
      let deletedItems = [...state.deletedItems];
      deletedItems.push(...Hlprs.flattenTree([item]));

      deletedItems = deletedItems
        .filter((element) => element.id > 0)
        .map((element) => element.id);

      return {
        ...state,
        synced: false,
        deletedItems,
        data,
        editableItem: null,
      };
    }

    case Actions.SYNC_SERVER: {
      return {
        ...state,
        synced: action.payload,
      };
    }
    case Actions.RESET_APP: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export default navMenuAdminReducer;
