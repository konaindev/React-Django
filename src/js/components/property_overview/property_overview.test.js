import React from "react";
import renderer from "react-test-renderer";

import PropertyOverview from "./index";

import props from "./props";

describe("PropertyOverview", () => {
  it("renders default", () => {
    const tree = renderer.create(<PropertyOverview {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without site and image", () => {
    const tree = renderer
      .create(
        <PropertyOverview
          {...props}
          project={props.projectWithoutSite}
          buildingImageURL={""}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without tags", () => {
    const tree = renderer
      .create(
        <PropertyOverview {...props} project={props.projectWithoutTags} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without stakeholders and characteristics", () => {
    const tree = renderer
      .create(
        <PropertyOverview {...props} project={props.projectWithoutTiles} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders with partial characteristics", () => {
    const tree = renderer
      .create(
        <PropertyOverview {...props} project={props.projectWithPartialTiles} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
