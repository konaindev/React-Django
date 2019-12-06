import React from "react";
import renderer from "react-test-renderer";

import EmailReportingTable from "./index";
import { groups, portfolio, properties } from "./props";

describe("EmailReportingTable", () => {
  it("renders portfolio table", () => {
    const tree = renderer
      .create(
        <EmailReportingTable
          properties={portfolio}
          propertiesCount={portfolio.length}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders groups table", () => {
    const tree = renderer
      .create(
        <EmailReportingTable
          properties={groups}
          propertiesCount={groups.length}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders properties table", () => {
    const tree = renderer
      .create(
        <EmailReportingTable
          properties={properties}
          propertiesCount={properties.length}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("has `view more` button", () => {
    const tree = renderer
      .create(
        <EmailReportingTable
          properties={properties.slice(0, 5)}
          showLoadBtn={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
