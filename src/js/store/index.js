import { createStore } from "redux";
import reducers from "../reducers";

const seedState = {
  test: {}
};

export default createStore(
  reducers,
  seedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
