import renderer from "react-test-renderer";
import { Provider } from "react-redux";

import storeFunc from "../../state/store";

import DashboardPage from "./index";
import { props } from "./props";

const { store } = storeFunc();

describe("DashboardPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <DashboardPage {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Row view", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <DashboardPage {...props} viewType="row" />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Row select", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <DashboardPage
            {...props}
            viewType="row"
            selectedProperties={props.properties.slice(0, 1)}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
