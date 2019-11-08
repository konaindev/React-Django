import React from "react";
import { Provider } from "react-redux";
import storeFunc from "./redux_base/store";
import { RemarkableRouter } from "./router";
import { PersistGate } from "redux-persist/es/integration/react";
import GaGate from "./gates/ga";
import TitleGate from "./gates/title";
import AuthGate from "./gates/auth";
import UIStringsGate from "./gates/ui_strings";

const { store, persistor } = storeFunc();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <TitleGate>
          <GaGate>
            <PersistGate loading={null} persistor={persistor}>
              <UIStringsGate>
                <AuthGate>
                  <RemarkableRouter />
                </AuthGate>
              </UIStringsGate>
            </PersistGate>
          </GaGate>
        </TitleGate>
      </Provider>
    );
  }
}

export { store };
