import _sortBy from "lodash/sortBy";
import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { withState } from "@dump247/storybook-state";
import { storiesOf } from "@storybook/react";

import { properties, groups, portfolio } from "../email_reporting_table/props";
import AccountSettings from "./index";
import { props } from "./props";

function validateSecurity(values) {
  const errors = {};
  if (values.password && values.password.length < 8) {
    errors.password = { length: "Must be at least 8 characters" };
  }
  return errors;
}

function onSort(store, propertiesName, sortValue) {
  let properties = _sortBy(store.state[propertiesName], ["name"]);
  if (sortValue === "desc") {
    properties = properties.reverse();
  }
  store.set({ [propertiesName]: properties });
}

function onSearch(store, properties, propertiesName, value) {
  let result = properties;
  if (value) {
    result = properties.filter(i => !!i.name.match(new RegExp(value, "i")));
  }
  store.set({ [propertiesName]: result });
}

storiesOf("AccountSettings", module)
  .add("Profile", () => (
    <Provider
      store={createStore(() => ({
        network: {}
      }))}
    >
      <AccountSettings
        initialItem="profile"
        {...props}
        itemsOrder={["profile"]}
      />
    </Provider>
  ))
  .add("Account Security", () => (
    <Provider
      store={createStore(() => ({
        network: {}
      }))}
    >
      <AccountSettings
        initialItem="lock"
        validate={validateSecurity}
        {...props}
        itemsOrder={["lock"]}
      />
    </Provider>
  ))
  .add(
    "Email Reports",
    withState({ groups })(({ store }) => (
      <Provider
        store={createStore(() => ({
          accountSettings: { properties },
          network: {}
        }))}
      >
        <AccountSettings
          initialItem="email"
          itemsOrder={["email"]}
          tabsOrder={props.tabsOrder}
          initialTab={props.initialTab}
          portfolioProperties={portfolio}
          groupsProperties={store.state.groups}
          onGroupsSort={sort => onSort(store, "groups", sort)}
          onPropertiesSort={sort => onSort(store, "properties", sort)}
          onPropertiesSearch={value =>
            onSearch(store, properties, "properties", value)
          }
          onGroupsSearch={value => onSearch(store, groups, "groups", value)}
        />
      </Provider>
    ))
  );
