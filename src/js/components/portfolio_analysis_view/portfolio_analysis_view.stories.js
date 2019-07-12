import React from "react";
import { withState } from "@dump247/storybook-state";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";

import { PortfolioAnalysisView } from "./index";
import { props } from "./props";

const initState = {
  selected_kpi_bundle: props.selected_kpi_bundle,
  date_selection: props.date_selection
};

storiesOf("PortfolioAnalysisView", module).add(
  "default",
  withState(initState)(({ store }) => (
    <PortfolioAnalysisView
      {...props}
      {...store.state}
      onChange={props => {
        store.set({ ...props });
        action("onChange")(props);
      }}
    />
  ))
);
