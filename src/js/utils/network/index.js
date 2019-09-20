import { call, put, takeLatest } from "redux-saga/effects";
import { networking } from "../../state/actions";
import { axiosGet, axiosPost } from "../api";

/*

network stack api

action.config === axios config
action.body === axios post body

*/

function* get(action) {
  try {
    const response = yield call(Api.fetchUser, action.payload.userId);
    yield put(networking.results(response));
    yield put(networking.success());
  } catch (e) {
    yield put(networking.fail(e.message));
  }
}

function* post(action) {
  try {
    const response = yield call(Api.fetchUser, action.payload.userId);
    yield put(networking.results(response));
    yield put(networking.success());
  } catch (e) {
    yield put(networking.fail(e.message));
  }
}

function* getSaga() {
  yield takeLatest("FETCH_API_GET", get);
}

function* postSaga() {
  yield takeLatest("FETCH_API_GET", post);
}

export default [getSaga, postSaga];
