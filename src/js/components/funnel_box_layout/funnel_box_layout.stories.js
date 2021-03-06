import React from "react";
import { storiesOf } from "@storybook/react";

import { FunnelNumberBox, FunnelPercentBox, FunnelCurrencyBox } from "./index";
import { props1, props2, props3 } from "./props";

storiesOf("FunnelBoxLayout", module)
  .add("number", () => <FunnelNumberBox {...props1} />)
  .add("percentage", () => <FunnelPercentBox {...props2} />)
  .add("currency", () => <FunnelCurrencyBox {...props3} />)
  .add("cta", () => (
    <FunnelCurrencyBox {...props3} ctaCallback={() => alert("test")} />
  ))
  .add("health", () => <FunnelCurrencyBox {...props3} performanceRating={1} />);
