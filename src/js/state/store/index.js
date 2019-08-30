import { createStore, applyMiddleware, compose } from "redux";
import reducers from "../reducers";
import {
  fetchDashboard,
  fetchTutorial,
  fetchCreatePassword
} from "../middleware";

// TODO: contextually enable devtools based on prod or not
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  reducers,
  composeEnhancers(
    applyMiddleware(
      //window.__REDUX_DEVTOOLS_EXTENSION__ &&
      //  window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 }),
      fetchDashboard,
      fetchTutorial,
      fetchCreatePassword
    )
  )
);
