import { createStore, applyMiddleware, compose } from "redux";
import reducers from "../reducers";
import {
  fetchDashboard,
  fetchTutorial,
  fetchCreatePassword,
  fetchCompany,
  fetchCompleteAccount,
  sendGaEvent
} from "../middleware";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const cfg = {
  key: "rmb",
  storage,
  whitelist: ["network"] // NOTE: this is where we elect what to persist
};

// TODO: contextually enable devtools based on prod or not
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const presistedReducer = persistReducer(cfg, reducers);

export default () => {
  const store = createStore(
    presistedReducer,
    composeEnhancers(
      applyMiddleware(
        //window.__REDUX_DEVTOOLS_EXTENSION__ &&
        //  window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 }),
        fetchDashboard,
        fetchTutorial,
        fetchCreatePassword,
        fetchCompany,
        fetchCompleteAccount,
        sendGaEvent
      )
    )
  );
  const persistor = persistStore(store);
  return { store, persistor };
};
