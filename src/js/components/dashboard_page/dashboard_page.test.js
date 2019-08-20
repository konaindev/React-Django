import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import { createStore } from "redux";

import DashboardPage from "./index";
import { props } from "./props";

import { props as tutorialProps } from "../tutorial_modal/props";

const _ = x =>
  createStore(() => ({
    general: x,
    network: { isFetching: false },
    tutorial: { tutorialView: tutorialProps }
  }));

describe("DashboardPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={_(props)}>
          <DashboardPage />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Row view", () => {
    const tree = renderer
      .create(
        <Provider store={_(props)}>
          <DashboardPage viewType="row" />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Row select", () => {
    const tree = renderer
      .create(
        <Provider store={_(props)}>
          <DashboardPage
            viewType="row"
            selectedProperties={[props.properties[0].property_id]}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
