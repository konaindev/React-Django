import React from "react";
import renderer from "react-test-renderer";

import EmailReportingRow from "./index";

describe("EmailReportingRow", () => {
  it("renders groups with properties", () => {
    const tree = renderer
      .create(
        <EmailReportingRow
          title="Portfolio"
          groupsCount={2}
          propertiesCount={16}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders groups", () => {
    const tree = renderer
      .create(<EmailReportingRow title="Group" propertiesCount={16} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders property", () => {
    const tree = renderer
      .create(<EmailReportingRow title="Property" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders property with checked button", () => {
    const tree = renderer
      .create(<EmailReportingRow title="Property" checked={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
