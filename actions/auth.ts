import { createAction } from "@reduxjs/toolkit";
import { IUserCredentials } from "../../types/auth";

export const setLoading = createAction<boolean>("SET_LOADING");
export const setCredentials = createAction<{
  token?: string;
  expire?: Date | string;
  user?: IUserCredentials;
}>("SET_CREDENTIALS");

export const setLogout = createAction("SET_LOGOUT");
