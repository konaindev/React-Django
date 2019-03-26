import React from "react";

import { storiesOf } from "@storybook/react";

import { Breadcrumbs } from "./index";

const props = {
  breadcrumbs: [
    {
      text: "Releases",
      link: "/releases"
    },
    {
      text: "2.15.8 Release Title | 3/21/2019"
    }
  ]
};

storiesOf("Breadcrumbs", module).add("default", () => (
  <Breadcrumbs {...props} />
));
