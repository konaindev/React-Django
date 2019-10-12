import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";

import EmailReportingRow from "./index";

const style = {
  height: "100vh",
  padding: "2rem",
  background: "#f6f6f6"
};

storiesOf("EmailReportingRow", module)
  .add("portfolio", () => (
    <div style={style}>
      <EmailReportingRow
        title="Portfolio"
        groupsCount={2}
        propertiesCount={16}
        onToggle={checked => action("Send report")(checked)}
      />
    </div>
  ))
  .add("group", () => (
    <div style={style}>
      <EmailReportingRow
        title="Southwestern"
        propertiesCount={6}
        onToggle={checked => action("Send report")(checked)}
      />
    </div>
  ))
  .add("property", () => (
    <div style={style}>
      <EmailReportingRow
        title="Adams Lane Flats"
        onToggle={checked => action("Send report")(checked)}
      />
    </div>
  ));
