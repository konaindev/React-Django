import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  API_URL_PREFIX,
  PROJECT_OVERALL_GET,
  projectOverallSuccess
} from "../actions";
import { axiosGet } from "../../utils/api";

function* fetchOverall({ publicId }) {
  try {
    const url = `${API_URL_PREFIX}/projects/${publicId}/overall`;
    const response = yield call(axiosGet, url);
    yield put(projectOverallSuccess(response.data));
  } catch (e) {
    throw e;
    // yield handleError(action)(e);
  }
}

function* fetchOverallWatcher() {
  yield takeLatest(PROJECT_OVERALL_GET.REQUEST, fetchOverall);
}

export default function*() {
  yield all([fetchOverallWatcher()]);
}
