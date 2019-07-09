import React from "react";
import { storiesOf } from "@storybook/react";

import PageChrome from "./index";

const navLinks = {
  links: [
    {
      id: "portfolio",
      name: "Portfolio",
      url: "http://app.remarkably.io/dashboard"
    },
    {
      id: "portfolio-analysis",
      name: "Portfolio Analysis",
      url: "http://app.remarkably.io/portfolio-analysis"
    }
  ],
  selected_link: "portfolio"
};

storiesOf("PageChrome", module)
  .add("default", () => <PageChrome>content</PageChrome>)
  .add("with nav links", () => (
    <PageChrome navLinks={navLinks}>content</PageChrome>
  ));
