import { authSaga } from "./sagas/auth";
import { all, call } from "redux-saga/effects";

export const rootSaga = function* () {
  yield all([call(authSaga)]);
};
