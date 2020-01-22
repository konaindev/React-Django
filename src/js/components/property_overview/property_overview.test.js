import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";

import PropertyOverview from "./index";
import props from "./props";

const store = createStore(() => ({ projectReports: {} }));

describe("PropertyOverview", () => {
  it("renders default", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PropertyOverview {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders is member", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PropertyOverview {...props} project={props.projectNotAdmin} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without site and image", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PropertyOverview
            {...props}
            project={props.projectWithoutSite}
            buildingImageURL={""}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without tags", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PropertyOverview {...props} project={props.projectWithoutTags} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without stakeholders and characteristics", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PropertyOverview {...props} project={props.projectWithoutTiles} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders with partial characteristics", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PropertyOverview
            {...props}
            project={props.projectWithPartialTiles}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
