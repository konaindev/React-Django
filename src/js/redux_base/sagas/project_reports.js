import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  API_URL_PREFIX,
  PROJECT_OVERALL_GET,
  PROJECT_REPORTS_GET,
  projectOverallSuccess,
  projectReportsSuccess
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

function* fetchReports({ publicId, reportType, reportSpan }) {
  try {
    let url = `${API_URL_PREFIX}/projects/${publicId}/reports?report_type=${reportType}`;
    if (reportSpan) {
      url += `&report_span=${reportSpan}`;
    }
    const response = yield call(axiosGet, url);
    yield put(projectReportsSuccess(response.data));
  } catch (e) {
    throw e;
    // yield handleError(action)(e);
  }
}

function* fetchOverallWatcher() {
  yield takeLatest(PROJECT_OVERALL_GET.REQUEST, fetchOverall);
}

function* fetchReportsWatcher() {
  yield takeLatest(PROJECT_REPORTS_GET.REQUEST, fetchReports);
}

export default function*() {
  yield all([fetchOverallWatcher(), fetchReportsWatcher()]);
}
