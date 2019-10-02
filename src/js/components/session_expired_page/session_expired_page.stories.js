import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import SessionExpiredPage from "./index";

storiesOf("SessionExpiredPage", module).add("default", () => (
  <SessionExpiredPage />
));
