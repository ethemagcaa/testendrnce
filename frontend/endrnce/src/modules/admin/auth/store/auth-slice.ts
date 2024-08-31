import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStateModel } from "@modules/admin/auth/model/AuthStateModel";

const initialAuthState: AuthStateModel = {
    isAuthenticated: false,
    token: undefined,
};

const authSlice = createSlice({
    name: "authentication",
    initialState: initialAuthState,
    reducers: {
        login(state, action: PayloadAction<AuthStateModel>) {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.authType = action.payload.authType;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = undefined;
            state.authType = undefined;
        },

    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
