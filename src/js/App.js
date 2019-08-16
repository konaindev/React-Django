import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./state/store";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="app">{this.props.children}</div>
      </Provider>
    );
  }
}
