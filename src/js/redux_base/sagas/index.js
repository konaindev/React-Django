import { all, fork } from "redux-saga/effects";

// network
import network from "../../utils/network";

export default function* rootSaga() {
  yield all([fork(network)]);
}
