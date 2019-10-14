import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import renderer from "react-test-renderer";

import { properties, groups, portfolio } from "../email_reporting_table/props";
import AccountSettings from "./index";
import { props } from "./props";

jest.mock("rc-tooltip");

describe("AccountSettings", () => {
  it("account security tab", () => {
    const tree = renderer
      .create(
        <Provider store={createStore(() => ({}))}>
          <AccountSettings initialItem="lock" {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("profile tab", () => {
    const tree = renderer
      .create(
        <Provider store={createStore(() => ({}))}>
          <AccountSettings initialItem="profile" {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("email reports 'Portfolio' tab", () => {
    const tree = renderer
      .create(
        <Provider store={createStore(() => ({}))}>
          <AccountSettings
            initialItem="email"
            itemsOrder={props.itemsOrder}
            initialTab="portfolio"
            portfolioProperties={portfolio}
            groupsProperties={groups}
            properties={properties}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("email reports 'Groups' tab", () => {
    const tree = renderer
      .create(
        <Provider store={createStore(() => ({}))}>
          <AccountSettings
            initialItem="email"
            itemsOrder={props.itemsOrder}
            initialTab="group"
            portfolioProperties={portfolio}
            groupsProperties={groups}
            properties={properties}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("email reports 'Properties' tab", () => {
    const tree = renderer
      .create(
        <Provider store={createStore(() => ({}))}>
          <AccountSettings
            initialItem="email"
            itemsOrder={props.itemsOrder}
            initialTab="property"
            portfolioProperties={portfolio}
            groupsProperties={groups}
            properties={properties.slice(0, 5)}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
