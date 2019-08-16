import renderer from "react-test-renderer";

import MarketReportPage from "./index";
import props from "./props";
import { Provider } from "react-redux";
import { createStore } from "redux";

describe("MarketReportPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={createStore(() => props)}>
          <MarketReportPage {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
