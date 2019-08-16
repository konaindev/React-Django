import renderer from "react-test-renderer";

import ModelingReportPage from "./index";
import props from "./props.js";
import { Provider } from "react-redux";
import { createStore } from "redux";

describe("ModelingReportPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={createStore(() => props)}>
          <ModelingReportPage {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
