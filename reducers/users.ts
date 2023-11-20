import { createReducer } from "@reduxjs/toolkit";
import { setUsers, setLoading } from "../actions/users";

interface UsersState {
  users: [];
  loading: boolean;
}

const initialState: UsersState = {
  users: [],
  loading: false,
};

export const users = createReducer(initialState, (builder) => {
  builder
    .addCase(setUsers, (state, action) => {
      state.users = action.payload;
    })
    .addCase(setLoading, (state, action) => {
      state.loading = action.payload;
    });
});
