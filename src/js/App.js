import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";

import UIStringsGate from "./gates/ui_strings";
import storeFunc from "./state/store";

const { store, persistor } = storeFunc();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <UIStringsGate>
            <div className="app">{this.props.children}</div>
          </UIStringsGate>
        </PersistGate>
      </Provider>
    );
  }
}

export { store };
