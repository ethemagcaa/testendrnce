import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@modules/admin/auth/store/auth-slice";

const rootReducer = combineReducers({
    auth: authReducer,
});

export default rootReducer;
