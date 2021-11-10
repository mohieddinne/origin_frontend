import * as Actions from "../../actions/fuse/navigation.actions";
import navigationConfig from "app/fuse-configs/navigationConfig";

const initialState = navigationConfig;

const navigation = function (state = initialState, action) {
  switch (action.type) {
    case Actions.GET_NAVIGATION: {
      return action.payload;
    }
    case Actions.SET_NAVIGATION: {
      return [...action.payload];
    }
    case Actions.DO_FETCH: {
      if (action.payload) return null;
      return initialState;
    }
    case Actions.RESET_NAVIGATION: {
      return action.payload;
    }
    case Actions.UPDATE_ITEM: {
      return state;
    }
    case Actions.UPDATE_COUNT_ITEM: {
      const { url, count } = action.payload;
      const item = state.find((item) => {
        return (item.url || "").includes(url);
      });
      if (item) {
        if (!item.badge) {
          item.badge = { title: 0 };
        }
        if (typeof count === "number") {
          if (count < 0) item.badge.title = item.badge.title + count;
          else item.badge.title = count;
        } else item.badge.title++;
        if (!item.badge.title || item.badge.title < 0)
          item.badge = null;
        return [
          ...(state || []).map((e) => {
            if (e.id === item.id) return { ...item };
            return e;
          }),
        ];
      }
      return state;
    }

    default: {
      return state;
    }
  }
};

export default navigation;
