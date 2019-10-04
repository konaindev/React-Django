import React from "react";
import { withState } from "@dump247/storybook-state";
import { storiesOf } from "@storybook/react";

import EmailReportingTable from "./index";
import { groups, portfolio, properties } from "./props";

const style = {
  height: `${70 * properties.length + 120}px`,
  padding: "2rem",
  background: "#20272e"
};

const firstProperties = properties.slice(0, 6);

storiesOf("EmailReportingTable", module)
  .add(
    "properties",
    withState({ properties: firstProperties })(({ store }) => (
      <div style={style}>
        <EmailReportingTable
          properties={store.state.properties}
          onLoad={() => {
            store.set({ properties: properties });
          }}
          propertiesCount={properties.length}
        />
      </div>
    ))
  )
  .add("groups", () => (
    <div style={{ ...style, height: "100vh" }}>
      <EmailReportingTable
        properties={groups}
        propertiesCount={groups.length}
      />
    </div>
  ))
  .add("portfolio", () => (
    <div style={{ ...style, height: "100vh" }}>
      <EmailReportingTable
        properties={portfolio}
        propertiesCount={portfolio.length}
      />
    </div>
  ));
