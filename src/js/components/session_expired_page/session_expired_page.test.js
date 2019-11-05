import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";

import storeFunc from "../../redux_base/store";
import SessionExpired from "./index";

const { store } = storeFunc();

describe("SessionExpired", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Provider store={store}><SessionExpired /></Provider>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
