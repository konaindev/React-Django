import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";

import SessionExpired from "./index";
import _store from "../../state/store";

describe("SessionExpired", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Provider store={_store}><SessionExpired /></Provider>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
