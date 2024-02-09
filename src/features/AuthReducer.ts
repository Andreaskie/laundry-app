// AuthReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { firebase } from "../../config";

export interface AuthState {
  user: firebase.User | null;
  isLoggedIn: boolean;
  token: string;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: firebase.User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.token = action.payload.token;
    },

    signout: (state) => {
      state.isLoggedIn = false;
      state.token = "";
      state.user = null;
    },
  },
});

export const { login, signout } = authSlice.actions;
export default authSlice.reducer;
