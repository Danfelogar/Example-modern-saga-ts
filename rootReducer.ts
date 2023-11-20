import { auth } from "./reducers/auth";
import { users } from "./reducers/users";
import { settings } from "./reducers/settings";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  auth,
  users,
  settings,
});
