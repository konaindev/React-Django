import React, { Component } from "react";
import { Provider } from "react-redux";
import storeFunc from "./state/store";
import { RemarkableRouter } from "./router";
import { PersistGate } from "redux-persist/es/integration/react";
import GaGate from "./gates/ga";
const { store, persistor } = storeFunc();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <GaGate>
          <PersistGate loading={null} persistor={persistor}>
            <RemarkableRouter />
          </PersistGate>
        </GaGate>
      </Provider>
    );
  }
}
