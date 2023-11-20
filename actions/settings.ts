import { createAction } from "@reduxjs/toolkit";
import { INotificationMessage } from "../../types/settings";

export const toggleState = createAction<{
  type: "modal" | "drawer" | "modalLogin" | "modalUserInfo" | "modalPassword";
  forceState?: boolean;
}>("TOGGLE_STATE");

export const sendNotification = createAction<{
  message: INotificationMessage | string;
  type: "success" | "error" | "warning";
}>("SEND_NOTIFICATION");

export const setErrorMessage = createAction<string[] | []>("SET_ERROR_MESSAGE");
export const setClearMessageError = createAction("SET_CLEAR_MESSAGE_ERROR");
export const setClearMessageSuccess = createAction("SET_CLEAR_MESSAGE_SUCCESS");
export const setSuccessMessage = createAction<string[] | [] | string>(
  "SET_SUCCESS_MESSAGE"
);
