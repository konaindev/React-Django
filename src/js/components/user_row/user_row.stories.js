import React from "react";
import { storiesOf } from "@storybook/react";

import UserRow from "./index";
import { props } from "./props";

storiesOf("UserRow", module)
  .add("default", () => <UserRow {...props} />)
  .add("without avatar", () => <UserRow {...props} profile_image_url="" />);
