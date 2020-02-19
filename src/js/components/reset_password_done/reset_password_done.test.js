import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import ResetPasswordDone from "./index";
import { createStore } from "redux";

const store = createStore(() => ({}));

describe("ResetPasswordDone", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <ResetPasswordDone></ResetPasswordDone>
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
