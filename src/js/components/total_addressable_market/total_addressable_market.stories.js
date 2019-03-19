import React from "react";

import { storiesOf } from "@storybook/react";

import props from "./MarketAnalysis.js";
import TotalAddressableMarket from "./index";

storiesOf("TotalAddressableMarket (TAM)", module).add("default", () => (
  <TotalAddressableMarket {...props} />
));
