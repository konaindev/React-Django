import React from "react";
import { storiesOf } from "@storybook/react";
import { Provider } from "react-redux";

import storeFunc from "../../redux_base/store";

import UserMenu from "./index";
import { props } from "./props";

const { store } = storeFunc();
const withProvider = story => <Provider store={store}>{story()}</Provider>;

storiesOf("UserMenu", module)
  .addDecorator(withProvider)
  .add("default", () => (
    <div style={{ marginTop: 10, marginLeft: 300 }}>
      <UserMenu {...props} />
    </div>
  ));
