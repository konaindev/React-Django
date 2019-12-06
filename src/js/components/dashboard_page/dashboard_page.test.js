import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import { DashboardPage } from "./index";
import { props } from "./props";

const _ = x => createStore(() => ({ tutorial: { tutorialView: x } }));

describe("DashboardPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <DashboardPage {...props} />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Row view", () => {
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <DashboardPage {...props} viewType="row" />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Row select", () => {
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <DashboardPage
              {...props}
              viewType="row"
              selectedProperties={props.properties.slice(0, 1)}
            />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders for admin", () => {
    const newProps = { ...props };
    newProps.user.is_superuser = true;
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <DashboardPage {...newProps} />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
