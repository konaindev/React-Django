import { all, call, put, takeEvery } from "redux-saga/effects";

import { networking, token, auth } from "../../redux_base/actions";
import { axiosGet, axiosPost } from "../../utils/api";
import { qsStringify } from "../../utils/misc";

/**
 * checkStatus
 *
 * note: this provides a surface for reacting to token errors (401)
 *       and builds on the asumption that the API behavior is static
 *       ...despite my dislike of the conventions :p
 *
 * @param {Obj} response - axios response object (raw)
 */
const checkStatus = response =>
  new Promise((resolve, reject) => {
    if (response.status === 401) {
      const { code } = response.data;
      const { messages } = response.data;
      let isAccessToken = false;
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].token_type === "access") {
          isAccessToken = true;
        }
      }
      switch (code) {
        case "token_not_valid": {
          isAccessToken
            ? reject({ code: "access_token_invalid" })
            : reject({ code });
          break;
        }
        default:
          resolve();
      }
    } else {
      resolve();
    }
  });

/**
 * handleError
 *
 * note:  the primary purpose is to either request a refresh token,
 *        or "logout" the user if the refresh is invalid (thus the session)
 *        is expired...
 * @param {Obj} action - redux action
 * @param {Obj} e - error object (custom)
 */
function handleError(action) {
  return function* handleError(e) {
    if (e.code) {
      switch (e.code) {
        case "token_not_valid": {
          yield put(auth.logout());
          break;
        }
        default:
          yield put(token.refresh());
      }
    } else {
      console.log("something was wrong!!!", e);
      const { type, url } = action;
      yield put(networking.fail({ message: e.message, type, url }));

      // The request was made but no response was received
      if (e.request) {
        const errorContext = {
          code: "",
          title: "Network Error",
          description: "Service unavailable"
        };
        window.location.replace(`/error${qsStringify(errorContext)}`);
      }
    }
  };
}
function* get(action) {
  try {
    yield put({ type: `${action.baseActionType}_REQUEST` });
    yield put(networking.startFetching(action.branch));
    const response = yield call(axiosGet, action.url);
    yield checkStatus(response);
    yield put({
      type: `${action.baseActionType}_SUCCESS`,
      payload: response.data
    });
    yield put(networking.results(response.data, action.branch));
    yield put(networking.success());
  } catch (e) {
    yield handleError(action)(e);
    yield put({ type: `${action.baseActionType}_ERROR`, payload: e });
  }
}

function* post(action) {
  try {
    yield put({ type: `${action.baseActionType}_REQUEST` });
    const response = yield call(axiosPost, action.url, action.body);
    yield checkStatus(response);
    yield put({
      type: `${action.baseActionType}_SUCCESS`,
      payload: response.data
    });
    yield put(networking.results(response.data, action.branch));
    yield put(networking.success());
  } catch (e) {
    yield handleError(action)(e);
    yield put({ type: `${action.baseActionType}_ERROR`, payload: e });
  }
}

function* getSaga() {
  yield takeEvery("FETCH_API_GET", get);
}

function* postSaga() {
  yield takeEvery("FETCH_API_POST", post);
}

export default function*() {
  yield all([getSaga(), postSaga()]);
}
