import React from "react";

import { storiesOf } from "@storybook/react";

import PropertyOverview from "./index";
import props from "./props";

storiesOf("PropertyOverview", module)
  .add("default", () => <PropertyOverview {...props} />)
  .add("without site and image", () => (
    <PropertyOverview
      {...props}
      project={props.projectWithoutSite}
      buildingImageURL={null}
    />
  ))
  .add("without tags", () => (
    <PropertyOverview {...props} project={props.projectWithoutTags} />
  ))
  .add("without stakeholders and characteristics", () => (
    <PropertyOverview {...props} project={props.projectWithoutTiles} />
  ))
  .add("with partial characteristics", () => (
    <PropertyOverview {...props} project={props.projectWithPartialTiles} />
  ));
