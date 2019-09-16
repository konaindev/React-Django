import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./state/store";
import { RemarkableRouter } from "./router";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RemarkableRouter />
        {/* <AppRouter>
          {/* <div className="app">{this.props.children}</div> */}
        {/* {/* </AppRouter> */}
      </Provider>
    );
  }
}
