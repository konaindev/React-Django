import renderer from "react-test-renderer";
import { createStore } from "redux";
import { Provider } from "react-redux";

import CompleteAccountView from "./index";
import { props } from "./props";

const _ = x =>
  createStore(() => ({ completeAccount: x, network: { ifFetching: false } }));

describe("CompleteAccountView", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={_(props)}>
          <CompleteAccountView />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
