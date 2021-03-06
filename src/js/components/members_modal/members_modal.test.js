import React from "react";
import renderer from "react-test-renderer";
import { createStore } from "redux";
import { Provider } from "react-redux";

import { InviteModalUI, ViewMembersModalUI } from "./index";
import { props, multiProps } from "./props";

jest.mock("react-responsive-modal", () => "Modal");

const store = createStore(() => ({}));

describe("InviteModalUI", () => {
  it("renders with single properties", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <InviteModalUI {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders with multiple properties", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <InviteModalUI {...multiProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("ViewMembersModalUI", () => {
  it("renders members", () => {
    const tree = renderer
      .create(
        <ViewMembersModalUI property={props.properties[0]} isOpen={true} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
