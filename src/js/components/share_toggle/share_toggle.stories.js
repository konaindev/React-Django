import React from "react";

import { storiesOf } from "@storybook/react";

import { StorybookContainer } from "../../utils/storybook-helper.stories";
import ShareToggle from "./index";

storiesOf("ShareToggle", module).add("default", () => (
  <StorybookContainer>
    <ShareToggle
      shared={true}
      share_url="link_copied"
      change_url="/project/pro_example/change"
      current_report_name="baseline"
    />
  </StorybookContainer>
));
