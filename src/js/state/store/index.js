import { createStore, applyMiddleware, compose } from "redux";
import reducers from "../reducers";
import createSagaMiddleware from "redux-saga";
import {
  fetchDashboard,
  fetchTutorial,
  fetchCreatePassword,
  fetchCompany,
  fetchCompleteAccount,
  sendGaEvent,
  applyApiResult
} from "../middleware";
import sagas from "../../utils/network";

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

const sagaMiddleware = createSagaMiddleware();

export default () => {
  const store = createStore(
    presistedReducer,
    composeEnhancers(
      applyMiddleware(
        fetchDashboard,
        fetchTutorial,
        fetchCreatePassword,
        fetchCompany,
        fetchCompleteAccount,
        sendGaEvent,
        applyApiResult,
        sagaMiddleware
      )
    )
  );
  const persistor = persistStore(store);
  sagas.forEach(saga => sagaMiddleware.run(saga));
  return { store, persistor };
};
