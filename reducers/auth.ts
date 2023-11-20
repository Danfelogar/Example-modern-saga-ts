import { createReducer } from "@reduxjs/toolkit";
import { IUserCredentials } from "../../types/auth";
import { setLoading, setCredentials, setLogout } from "../actions/auth";

interface AuthState {
  loading: boolean;
  credentials: {
    token?: string;
    expire?: Date | string;
    user?: IUserCredentials;
  };
}

const initialState: AuthState = {
  loading: false,
  credentials: {
    token: undefined,
    expire: undefined,
    user: undefined,
  },
};

export const auth = createReducer(initialState, (builder) => {
  builder
    .addCase(setLoading, (state, action) => {
      state.loading = action.payload;
    })
    .addCase(setCredentials, (state, action) => {
      state.credentials = action.payload;
    })
    .addCase(setLogout, (state) => {
      state.credentials = initialState.credentials;
    });
});
