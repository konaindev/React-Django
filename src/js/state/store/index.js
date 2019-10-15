import { createStore, applyMiddleware, compose } from "redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

import reducers from "../reducers";
import createSagaMiddleware from "redux-saga";
import {
  fetchDashboard,
  fetchCreatePassword,
  fetchCompany,
  fetchCompleteAccount,
  sendGaEvent,
  applyApiResult,
  logoutMiddleware,
  fetchInviteModal,
  fetchUIString,
  refreshToken
} from "../middleware";
import sagas from "../../utils/network";

const cfg = {
  key: "rmb",
  storage,
  whitelist: ["token", "nav", "uiStrings"] // NOTE: this is where we elect what to persist
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
        fetchCreatePassword,
        fetchCompany,
        fetchCompleteAccount,
        sendGaEvent,
        applyApiResult,
        sagaMiddleware,
        logoutMiddleware,
        fetchInviteModal,
        fetchUIString,
        refreshToken
      )
    )
  );
  const persistor = persistStore(store);
  sagas.forEach(saga => sagaMiddleware.run(saga));
  return { store, persistor };
};
