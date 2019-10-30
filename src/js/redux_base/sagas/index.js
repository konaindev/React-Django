import { all, fork, take, cancel } from "redux-saga/effects";

// network
import network from "../../utils/network";
import projectReports from "./project_reports";

export default function* rootSaga() {
  yield all([fork(network), fork(projectReports)]);
}
