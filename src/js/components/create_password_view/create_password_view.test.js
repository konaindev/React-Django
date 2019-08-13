import renderer from "react-test-renderer";
import { createStore } from "redux";
import { Provider } from "react-redux";

import CreatePasswordView from "./index";
import { props } from "./props";

jest.mock("rc-tooltip");
const _ = x => createStore(() => ({ createPassword: x }));

describe("CreatePasswordView", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={_(props)}>
          <CreatePasswordView />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
