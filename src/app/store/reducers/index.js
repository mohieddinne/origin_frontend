import { combineReducers } from '@reduxjs/toolkit';
import fuse from "./fuse";
import auth from "app/auth/store/reducers";
import quickPanel from "app/fuse-layouts/shared-components/quickPanel/store/reducers";

const createReducer = asyncReducers => (state, action) => {
	const combinedReducer = combineReducers({
		auth,
		fuse,
    quickPanel,
		...asyncReducers
	});

	/*
	Reset the redux store when user logged out
	 */
	if (action.type === 'auth/user/userLoggedOut') {
		state = undefined;
	}

	return combinedReducer(state, action);
};

export default createReducer;
