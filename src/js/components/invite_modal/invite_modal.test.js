import React from "react";
import renderer from "react-test-renderer";
import { createStore } from "redux";
import { Provider } from "react-redux";

import InviteModal from "./index";
import { props, multiProps } from "./props";

jest.mock("react-responsive-modal", () => "Modal");

const _ = x => createStore(() => x);

describe("InviteModal", () => {
  it("renders with single properties", () => {
    const tree = renderer
      .create(
        <Provider store={_(props)}>
          <InviteModal />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders with multiple properties", () => {
    const tree = renderer
      .create(
        <Provider store={_(multiProps)}>
          <InviteModal />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
