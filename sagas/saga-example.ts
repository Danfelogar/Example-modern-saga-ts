import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { APP_URL } from "../../config/environments";
import { serviceBasePrivate } from "../../config/middleware";
import {
  INoTransactionalData,
  INoTransactionalDataResponseSingle,
  IOptionsResponse,
  IOptionsResponseSingle,
  IOptionsResponseSuccess,
  IOptionsValues,
} from "../../types/options";
import {
  resetInitialValuesManagementOptions,
  resetInitialValuesNoTransactionalManagementOptions,
  setDataManagementOptions,
  setInitialValuesManagementOptions,
  setInitialValuesNoTransactionalManagementOptions,
  setIsUpdateManagementOptions,
  setIsUpdateNoTransactionalManagementOptions,
  setLoadingManagementOptions,
} from "../actions/optionsManagement";
import { sendNotification, setPagination } from "../actions/settings";
import { ICustomError } from "../../types/response";
import { serializeFilters } from "../../utils/transformsValues";
import { AxiosResponse } from "axios";
import { store } from "../store";

interface PropsByGetData {
  pageNumber?: number;
  pageSize?: number;
  description?: string;
  relationshipTypeId: number;
  displayTypeId: number;
  modalityId: number;
  optionTypeId: number;
  isActive: boolean;
}

const fetchGetOptionByIdSaga: (
  action: PayloadAction<number | string>
) => Generator = function* (action): Generator {
  try {
    yield put(setLoadingManagementOptions(true));
    yield put(resetInitialValuesManagementOptions());
    const response: unknown = yield call(() =>
      serviceBasePrivate.get(`${APP_URL}/api/Option/${action.payload}`)
    );

    const { data, httpCode } = (response as { data: IOptionsResponseSingle })
      .data;
    if (httpCode === 200) {
      yield put(
        setInitialValuesManagementOptions({
          initialValues: {
            optionId: data.optionId,
            description: data.description,
            relationshipTypeId: data.relationshipType?.relationshipTypeId || 0,
            displayTypeId: data.displayType?.displayTypeId || 0,
            modalityId: data.modality?.modalityId || 0,
            optionTypeId: data.optionType?.optionTypeId || 0,
            url: data.url,
            isActive: data.isActive,
            modificationUser: data.modificationUser,
            modificationDate: data.modificationDate,
          },
        })
      );
      yield put(setIsUpdateManagementOptions(true));
    }
  } catch (error: unknown) {
    yield put(
      sendNotification({
        message: (error as ICustomError)?.response?.data?.errors[0],
        type: "error",
      })
    );
  } finally {
    yield put(setLoadingManagementOptions(false));
  }
};

const fetchGetDataOptionsSaga: (
  action: PayloadAction<PropsByGetData>
) => Generator = function* (action): Generator {
  const filterParams = {
    ...(action.payload.pageNumber && {
      pageNumber: action.payload.pageNumber,
    }),
    ...(action.payload.pageSize && {
      pageSize: action.payload.pageSize,
    }),
    ...(action.payload.description && {
      description: action.payload.description,
    }),
    ...(action.payload.relationshipTypeId && {
      relationshipTypeId: action.payload.relationshipTypeId,
    }),
    ...(action.payload.displayTypeId && {
      displayTypeId: action.payload.displayTypeId,
    }),
    ...(action.payload.modalityId && {
      modalityId: action.payload.modalityId,
    }),
    ...(action.payload.optionTypeId && {
      optionTypeId: action.payload.optionTypeId,
    }),
    ...(action.payload.isActive && {
      isActive: action.payload.isActive,
    }),
  };
  try {
    if (!action.payload.description) {
      yield put(setLoadingManagementOptions(true));
    }

    const response: unknown = yield call(() =>
      serviceBasePrivate.get(`/api/Option?${serializeFilters(filterParams)}`)
    );

    const { data, httpCode } = (response as { data: IOptionsResponse }).data;

    if (httpCode === 200) {
      // Convertir el encabezado x-Pagination a un objeto JSON
      const pagination = JSON.parse(
        (response as AxiosResponse).headers["x-pagination"]
      );

      // Obtener el valor de TotalPages
      const totalPages = pagination.TotalPages;
      yield put(setDataManagementOptions({ data }));
      yield put(setPagination({ totalPage: totalPages }));
    }
  } catch (error: unknown) {
    yield put(setDataManagementOptions({ data: [] }));
    yield put(
      sendNotification({
        message: (error as ICustomError)?.response?.data?.errors[0],
        type: "error",
      })
    );
  } finally {
    yield put(setLoadingManagementOptions(false));
  }
};

const postDataOptionSaga: (action: PayloadAction<IOptionsValues>) => Generator =
  function* (action): Generator {
    const {
      description,
      displayTypeId,
      isActive,
      modalityId,
      modificationUser,
      optionId,
      optionTypeId,
      relationshipTypeId,
      url,
      modificationDate,
    } = action.payload;
    const {
      pagination: { pageNumber, pageSize },
    } = store.getState().settings;

    try {
      yield put(setLoadingManagementOptions(true));

      const response: unknown = yield call(() =>
        serviceBasePrivate.post(`${APP_URL}/api/Option`, {
          description,
          displayTypeId,
          isActive,
          modalityId,
          modificationUser,
          optionId,
          optionTypeId,
          relationshipTypeId,
          url,
          modificationDate,
        })
      );
      const { data, httpCode } = (
        response as AxiosResponse<IOptionsResponseSuccess>
      ).data;
      if (httpCode === 200) {
        yield put(
          sendNotification({
            message: data,
            type: "success",
          })
        );
        yield put({
          type: "GET_DATA_OPTIONS_MANAGEMENT",
          payload: {
            pageNumber,
            pageSize,
            description: "",
          },
        });
      }
    } catch (error: unknown) {
      yield put(
        sendNotification({
          message: (error as ICustomError)?.response?.data?.errors[0],
          type: "error",
        })
      );
    } finally {
      yield put(setLoadingManagementOptions(false));
    }
  };

const putDataOptionSaga: (action: PayloadAction<IOptionsValues>) => Generator =
  function* (action): Generator {
    const {
      description,
      displayTypeId,
      isActive,
      modalityId,
      modificationUser,
      optionId,
      optionTypeId,
      relationshipTypeId,
      url,
      modificationDate,
    } = action.payload;
    const {
      pagination: { pageNumber, pageSize },
    } = store.getState().settings;
    try {
      yield put(setLoadingManagementOptions(true));

      const response: unknown = yield call(() =>
        serviceBasePrivate.put(`${APP_URL}/api/Option`, {
          description,
          displayTypeId,
          isActive,
          modalityId,
          modificationUser,
          optionId,
          optionTypeId,
          relationshipTypeId,
          url,
          modificationDate,
        })
      );
      const { data, httpCode } = (
        response as AxiosResponse<IOptionsResponseSuccess>
      ).data;
      if (httpCode === 200) {
        yield put(
          sendNotification({
            message: data,
            type: "success",
          })
        );
        yield put({
          type: "GET_DATA_OPTIONS_MANAGEMENT",
          payload: {
            pageNumber,
            pageSize,
            description: "",
          },
        });
      }
    } catch (error: unknown) {
      yield put(
        sendNotification({
          message: (error as ICustomError)?.response?.data?.errors[0],
          type: "error",
        })
      );
    } finally {
      yield put(setLoadingManagementOptions(false));
    }
  };

const deleteDataOptionSaga: (action: PayloadAction<number>) => Generator =
  function* (action): Generator {
    const {
      pagination: { pageNumber, pageSize },
    } = store.getState().settings;
    try {
      yield put(setLoadingManagementOptions(true));

      const response: unknown = yield call(() =>
        serviceBasePrivate.delete(`${APP_URL}/api/Option/${action.payload}`)
      );
      const { data, httpCode } = (
        response as AxiosResponse<IOptionsResponseSuccess>
      ).data;
      if (httpCode === 200) {
        yield put(
          sendNotification({
            message: data,
            type: "success",
          })
        );
        yield put({
          type: "GET_DATA_OPTIONS_MANAGEMENT",
          payload: {
            pageNumber,
            pageSize,
            description: "",
          },
        });
      }
    } catch (error: unknown) {
      yield put(
        sendNotification({
          message: (error as ICustomError)?.response?.data?.errors[0],
          type: "error",
        })
      );
    } finally {
      yield put(setLoadingManagementOptions(false));
    }
  };

const fetchGetOptionNoTransactionalByIdSaga: (
  action: PayloadAction<number | string>
) => Generator = function* (action): Generator {
  try {
    yield put(setLoadingManagementOptions(true));
    yield put(resetInitialValuesNoTransactionalManagementOptions());
    yield put({
      type: "GET_OPTION_BY_ID",
      payload: action.payload,
    });
    const response: unknown = yield call(() =>
      serviceBasePrivate.get(
        `${APP_URL}/api/InformativeContentOption/${action.payload}`
      )
    );

    const { data, httpCode } = (
      response as { data: INoTransactionalDataResponseSingle }
    ).data;
    if (httpCode === 200) {
      yield put(setInitialValuesNoTransactionalManagementOptions(data));
      yield put(setIsUpdateNoTransactionalManagementOptions(true));
    } else if (httpCode === 404) {
      yield put(resetInitialValuesNoTransactionalManagementOptions());
      yield put(setIsUpdateNoTransactionalManagementOptions(false));
    }
  } catch (error: unknown) {
    yield put(
      sendNotification({
        message: (error as ICustomError)?.response?.data?.errors[0],
        type: "error",
      })
    );
  } finally {
    yield put(setLoadingManagementOptions(false));
  }
};

const postDataOptionNoTransactionalSaga: (
  action: PayloadAction<INoTransactionalData>
) => Generator = function* (action): Generator {
  const {
    blockOrderDescription,
    blockOrderDocument,
    blockOrderImage,
    blockOrderTitle,
    description,
    informativeContentDocuments,
    informativeContentImages,
    informativeContentOptionId,
    optionId,
    title,
  } = action.payload;

  try {
    yield put(setLoadingManagementOptions(true));

    const response: unknown = yield call(() =>
      serviceBasePrivate.post(`${APP_URL}/api/InformativeContentOption`, {
        informativeContentOptionId,
        optionId,
        title,
        description,
        blockOrderTitle,
        blockOrderDescription,
        blockOrderImage,
        blockOrderDocument,
        informativeContentImages,
        informativeContentDocuments,
      })
    );

    const { data, httpCode } = (
      response as AxiosResponse<IOptionsResponseSuccess>
    ).data;
    if (httpCode === 200) {
      yield put(
        sendNotification({
          message: data,
          type: "success",
        })
      );
    }
  } catch (error: unknown) {
    yield put(
      sendNotification({
        message: (error as ICustomError)?.response?.data?.errors[0],
        type: "error",
      })
    );
  } finally {
    yield put(setLoadingManagementOptions(false));
  }
};

const putDataOptionNoTransactionalSaga: (
  action: PayloadAction<INoTransactionalData>
) => Generator = function* (action): Generator {
  const {
    blockOrderDescription,
    blockOrderDocument,
    blockOrderImage,
    blockOrderTitle,
    description,
    informativeContentDocuments,
    informativeContentImages,
    informativeContentOptionId,
    optionId,
    title,
  } = action.payload;

  try {
    yield put(setLoadingManagementOptions(true));

    const response: unknown = yield call(() =>
      serviceBasePrivate.put(`${APP_URL}/api/InformativeContentOption`, {
        informativeContentOptionId,
        optionId,
        title,
        description,
        blockOrderTitle,
        blockOrderDescription,
        blockOrderImage,
        blockOrderDocument,
        informativeContentImages,
        informativeContentDocuments,
      })
    );
    const { data, httpCode } = (
      response as AxiosResponse<IOptionsResponseSuccess>
    ).data;
    if (httpCode === 200) {
      yield put(
        sendNotification({
          message: data,
          type: "success",
        })
      );
    }
  } catch (error: unknown) {
    yield put(
      sendNotification({
        message: (error as ICustomError)?.response?.data?.errors[0],
        type: "error",
      })
    );
  } finally {
    yield put(setLoadingManagementOptions(false));
  }
};

const optionsManagementService: () => Generator = function* (): Generator {
  yield takeLatest("GET_OPTION_BY_ID", fetchGetOptionByIdSaga);
  yield takeLatest("GET_DATA_OPTIONS_MANAGEMENT", fetchGetDataOptionsSaga);
  yield takeLatest("POST_DATA_OPTION", postDataOptionSaga);
  yield takeLatest("PUT_DATA_OPTION", putDataOptionSaga);
  yield takeLatest("DELETE_DATA_OPTION", deleteDataOptionSaga);
  //no transactional
  yield takeLatest(
    "GET_OPTION_NO_TRANSACTIONAL_BY_ID",
    fetchGetOptionNoTransactionalByIdSaga
  );
  yield takeLatest(
    "POST_DATA_OPTION_NO_TRANSACTIONAL",
    postDataOptionNoTransactionalSaga
  );
  yield takeLatest(
    "PUT_DATA_OPTION_NO_TRANSACTIONAL",
    putDataOptionNoTransactionalSaga
  );
};

export const optionsManagementSaga: () => Generator = function* (): Generator {
  yield all([optionsManagementService()]);
};
