import React from "react";
import renderer from "react-test-renderer";
import { createStore } from "redux";
import { Provider } from "react-redux";

import InviteModal from "./index";
import { props, multiProps } from "./props";

jest.mock("react-responsive-modal", () => "Modal");

const store = createStore(() => ({}));

describe("InviteModal", () => {
  it("renders with single properties", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <InviteModal {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders with multiple properties", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <InviteModal {...multiProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
