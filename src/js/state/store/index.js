import { createStore } from "redux";
import reducers from "../reducers";

// TODO: contextually enable devtools based on prod or not
export default createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 })
);
