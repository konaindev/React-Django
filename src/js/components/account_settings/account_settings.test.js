import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import { properties, groups, portfolio } from "../email_reporting_table/props";
import AccountSettings from "./index";
import { props } from "./props";

jest.mock("rc-tooltip");

const _ = x =>
  createStore(() => ({
    network: {
      isFetching: false
    },
    accountSettings: {
      properties: [],
      pageNum: 0,
      hasNextPage: false
    }
  }));

describe("AccountSettings", () => {
  it("account security tab", () => {
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <AccountSettings initialItem="lock" {...props} />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("profile tab", () => {
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <AccountSettings initialItem="profile" {...props} />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("email reports 'Portfolio' tab", () => {
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <AccountSettings
              initialItem="email"
              initialTab="portfolio"
              portfolioProperties={portfolio}
              groupsProperties={groups}
              properties={properties}
            />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("email reports 'Groups' tab", () => {
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <AccountSettings
              initialItem="email"
              initialTab="group"
              portfolioProperties={portfolio}
              groupsProperties={groups}
              properties={properties}
            />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("email reports 'Properties' tab", () => {
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <AccountSettings
              initialItem="email"
              initialTab="property"
              portfolioProperties={portfolio}
              groupsProperties={groups}
              properties={properties.slice(0, 5)}
            />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
