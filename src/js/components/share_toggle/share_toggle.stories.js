import React from "react";

import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
// import { linkTo } from "@storybook/addon-links";
// import { withState } from "@dump247/storybook-state";

import { StorybookContainer } from "../../utils/storybook-helper.stories";
import ShareToggle from "./index";

storiesOf("ShareToggle", module).add("default", () => (
  <StorybookContainer>
    <ShareToggle shared={true} share_url={"link_copied"} />
  </StorybookContainer>
));
