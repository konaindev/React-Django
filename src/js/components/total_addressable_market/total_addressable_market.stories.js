import React from "react";

import { storiesOf } from "@storybook/react";

import props from "./MarketAnalysis.js";
import TotalAddressableMarket from "./index";

storiesOf("TotalAddressableMarket", module).add("default", () => (
  <TotalAddressableMarket {...props} />
));
