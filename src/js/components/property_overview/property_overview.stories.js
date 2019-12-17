import React from "react";
import { Provider } from "react-redux";
import { storiesOf } from "@storybook/react";

import storeFunc from "../../redux_base/store";

import PropertyOverview from "./index";
import props from "./props";

const { store } = storeFunc();
const withProvider = story => <Provider store={store}>{story()}</Provider>;

storiesOf("PropertyOverview", module)
  .addDecorator(withProvider)
  .add("default", () => <PropertyOverview {...props} />)
  .add("without site and image", () => (
    <PropertyOverview
      {...props}
      project={props.projectWithoutSite}
      buildingImageURL={""}
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
