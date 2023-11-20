import { createReducer } from "@reduxjs/toolkit";
import {
  toggleState,
  sendNotification,
  setErrorMessage,
  setSuccessMessage,
  setClearMessageError,
  setClearMessageSuccess,
} from "../actions/settings";
import { INotificationMessage } from "../../types/settings";

interface SettingsState {
  isShowModal: boolean;
  isShowDrawer: boolean;
  isShowModalLogin: boolean;
  isShowModalUserInfo: boolean;
  isShowModalPassword: boolean;
  notification: {
    message: INotificationMessage;
    type?: "success" | "error" | "warning";
  };
  messageError: string[] | [];
  messageSuccess: string[] | [] | string;
}

const initialState: SettingsState = {
  notification: {
    message: {
      title: "",
      content: "",
    },
    type: "success",
  },
  isShowModal: false,
  isShowDrawer: false,
  isShowModalLogin: false,
  isShowModalUserInfo: false,
  isShowModalPassword: false,
  messageSuccess: [],
  messageError: [],
};

export const settings = createReducer(initialState, (builder) => {
  builder
    .addCase(toggleState, (state, action) => {
      switch (action.payload.type) {
        case "modal":
          state.isShowModal = action.payload.forceState || !state.isShowModal;
          break;
        case "drawer":
          state.isShowDrawer = action.payload.forceState || !state.isShowDrawer;
          break;
        case "modalLogin":
          state.isShowModalLogin =
            action.payload.forceState || !state.isShowModalLogin;
          break;
        case "modalUserInfo":
          state.isShowModalUserInfo =
            action.payload.forceState || !state.isShowModalUserInfo;
          break;
        case "modalPassword":
          state.isShowModalPassword =
            action.payload.forceState || !state.isShowModalPassword;
          break;
        default:
          break;
      }
    })
    .addCase(sendNotification, (state, action) => {
      state.notification = {
        message: action.payload.message as INotificationMessage,
        type: action.payload.type
          ? action.payload.type
          : state.notification.type,
      };
    })
    .addCase(setSuccessMessage, (state, action) => {
      state.messageSuccess = action.payload;
    })
    .addCase(setClearMessageSuccess, (state) => {
      state.messageSuccess = [];
    })
    .addCase(setErrorMessage, (state, action) => {
      state.messageError = action.payload;
    })
    .addCase(setClearMessageError, (state) => {
      state.messageError = [];
    });
});
