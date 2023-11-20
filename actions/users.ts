import { createAction } from "@reduxjs/toolkit";

export const setUsers = createAction<[]>("SET_USERS");
export const setLoading = createAction<boolean>("SET_LOADING");
