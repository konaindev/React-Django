import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { createStore } from "redux";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";

import Input from "../../components/input";
import AddTagField from "./index";
import props from "./props";
import { mount } from "enzyme";

const store = createStore(() => ({
  projectReports: { ...props, isAddTagInput: false }
}));

describe("AddTagField", () => {
  it("renders button", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <AddTagField />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders input field", () => {
    store.getState().projectReports.isAddTagInput = true;
    let focused = false;
    const tree = renderer
      .create(
        <Provider store={store}>
          <AddTagField />
        </Provider>,
        {
          createNodeMock: e => {
            if (e.type === "input") {
              return {
                focus() {
                  focused = true;
                }
              };
            }
          }
        }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
    expect(focused).toBe(true);
  });
  it("renders input with suggestions", () => {
    store.getState().projectReports.isAddTagInput = true;
    const tree = mount(
      <Provider store={store}>
        <AddTagField />
      </Provider>
    );
    const input = tree.find("input");
    input.instance().value = "Test";
    input.simulate("change");
    expect(tree).toMatchSnapshot();
  });
});
