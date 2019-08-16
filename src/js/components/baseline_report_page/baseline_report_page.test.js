import renderer from "react-test-renderer";

import BaselineReportPage from "./index";
import props, { one_competitor_props, no_competitors_props } from "./props";
import { Provider } from "react-redux";
import { createStore } from "redux";

const _ = x => createStore(() => x);

describe("BaselineReportPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={_(props)}>
          <BaselineReportPage />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("One Competitor", () => {
    const tree = renderer
      .create(
        <Provider store={_(one_competitor_props)}>
          <BaselineReportPage />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("No Competitors", () => {
    const tree = renderer
      .create(
        <Provider store={_(no_competitors_props)}>
          <BaselineReportPage />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
