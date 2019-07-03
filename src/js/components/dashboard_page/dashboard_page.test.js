import renderer from "react-test-renderer";

import DashboardPage from "./index";
import { props } from "./props";
import { Provider } from "react-redux";
import { createStore } from "redux";

const _ = x => createStore(() => x);

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
