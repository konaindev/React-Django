import React from "react";
import { storiesOf } from "@storybook/react";

import UserIcon from "./index";
import { props } from "./props";

storiesOf("UserIcon", module)
  .add("default", () => <UserIcon {...props} />)
  .add("without avatar", () => <UserIcon {...props} profile_image_url="" />);
