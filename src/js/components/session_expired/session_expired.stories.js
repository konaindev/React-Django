import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import SessionExpired from "./index";

storiesOf("SessionExpired", module).add("default", () => <SessionExpired />);
