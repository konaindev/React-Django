import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import { CompleteAccountView } from "./index";
import { props } from "./props";

const _ = x =>
  createStore(() => ({
    network: {
      isFetching: false
    }
  }));

describe("CompleteAccountView", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <CompleteAccountView {...props} />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
