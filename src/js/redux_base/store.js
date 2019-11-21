import { createStore, applyMiddleware, compose } from "redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import createSagaMiddleware from "redux-saga";

import reducers from "./reducers";
import {
  fetchCreatePassword,
  fetchCompany,
  fetchCompleteAccount,
  sendGaEvent,
  startNetworkFetch,
  applyApiResult,
  logoutMiddleware,
  fetchInviteModal,
  fetchUIString,
  fetchAccountProperties,
  updateAccountSecurity,
  updateAccountProfile,
  updateReportsSettings,
  refreshToken
} from "./middleware";
import rootSaga from "./sagas";

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
        fetchCreatePassword,
        fetchCompany,
        fetchCompleteAccount,
        sendGaEvent,
        startNetworkFetch,
        applyApiResult,
        logoutMiddleware,
        fetchInviteModal,
        fetchUIString,
        fetchAccountProperties,
        updateAccountSecurity,
        updateAccountProfile,
        updateReportsSettings,
        refreshToken,
        sagaMiddleware
      )
    )
  );
  const persistor = persistStore(store);
  sagaMiddleware.run(rootSaga);
  return { store, persistor };
};