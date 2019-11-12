import React from "react";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import { properties, groups, portfolio } from "../email_reporting_table/props";
import AccountSettings from "./index";
import { props } from "./props";

jest.mock("rc-tooltip");

describe("AccountSettings", () => {
  it("account security tab", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <AccountSettings initialItem="lock" {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("profile tab", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <AccountSettings initialItem="profile" {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("email reports 'Portfolio' tab", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <AccountSettings
            initialItem="email"
            initialTab="portfolio"
            portfolioProperties={portfolio}
            groupsProperties={groups}
            properties={properties}
          />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("email reports 'Groups' tab", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <AccountSettings
            initialItem="email"
            initialTab="group"
            portfolioProperties={portfolio}
            groupsProperties={groups}
            properties={properties}
          />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("email reports 'Properties' tab", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <AccountSettings
            initialItem="email"
            initialTab="property"
            portfolioProperties={portfolio}
            groupsProperties={groups}
            properties={properties.slice(0, 5)}
          />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
