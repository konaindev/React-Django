import React, { Component } from "react";
import { Provider } from "react-redux";
import storeFunc from "./state/store";
import { RemarkableRouter } from "./router";
import { PersistGate } from "redux-persist/es/integration/react";
const { store, persistor } = storeFunc();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RemarkableRouter />
        </PersistGate>
      </Provider>
    );
  }
}
