import React from "react";
import { storiesOf } from "@storybook/react";

import AccountSettings from "./index";

storiesOf("AccountSettings", module)
  .add("Profile", () => <AccountSettings initialTab="profile" />)
  .add("Account Security", () => <AccountSettings initialTab="lock" />)
  .add("Email Reports", () => <AccountSettings initialTab="email" />);
