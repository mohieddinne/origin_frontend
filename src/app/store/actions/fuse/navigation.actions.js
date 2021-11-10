import FuseUtils from "@fuse/FuseUtils";

export const GET_NAVIGATION = "[NAVIGATION] GET NAVIGATION";
export const SET_NAVIGATION = "[NAVIGATION] SET NAVIGATION";
export const RESET_NAVIGATION = "[NAVIGATION] RESET NAVIGATION";
export const DO_FETCH = "[NAVIGATION] Refetch navigation";
export const UPDATE_ITEM = "[NAVIGATION] Update item";
export const UPDATE_COUNT_ITEM = "[NAVIGATION] Update count on item";

export function doRefetchNavigation(doRefetch) {
  return {
    type: DO_FETCH,
    payload: doRefetch,
  };
}

export function setNavigation(payload) {
  return {
    type: SET_NAVIGATION,
    payload,
  };
}

export function updateNavigation(menu) {
  return {
    type: SET_NAVIGATION,
    payload: menu,
  };
}

export function resetNavigation() {
  return {
    type: RESET_NAVIGATION,
    payload: [],
  };
}

export function appendNavigationItem(item, parentId) {
  return (dispatch, getState) => {
    const { navigation } = getState().fuse;
    return dispatch({
      type: SET_NAVIGATION,
      navigation: FuseUtils.appendNavItem(navigation, item, parentId),
    });
  };
}

export function prependNavigationItem(item, parentId) {
  return (dispatch, getState) => {
    const { navigation } = getState().fuse;
    return dispatch({
      type: SET_NAVIGATION,
      navigation: FuseUtils.prependNavItem(
        navigation,
        item,
        parentId
      ),
    });
  };
}

export function updateNavigationItem(id, item) {
  return (dispatch, getState) => {
    const { navigation } = getState().fuse;
    return dispatch({
      type: SET_NAVIGATION,
      navigation: FuseUtils.updateNavItem(navigation, id, item),
    });
  };
}

export function removeNavigationItem(id) {
  return (dispatch, getState) => {
    const { navigation } = getState().fuse;
    return dispatch({
      type: SET_NAVIGATION,
      navigation: FuseUtils.removeNavItem(navigation, id),
    });
  };
}

export function updateCountOnItem(url, count) {
  return {
    type: UPDATE_COUNT_ITEM,
    payload: { url, count },
  };
}
