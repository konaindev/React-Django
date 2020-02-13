import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import ResetPasswordForm from "./index";
import { createStore } from "redux";

const store = createStore(() => ({}));

describe("ResetPasswordForm", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <ResetPasswordForm />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
