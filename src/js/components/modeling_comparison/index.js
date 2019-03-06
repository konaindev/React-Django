import React from "react";
import { string, number, object, arrayOf, shape } from "prop-types";

import serialize from "./serializer";
import "./modeling_comparison.scss";

export function ModelingComparison({ property_name, options }) {
  const tableRows = serialize(options);

  return (
    <Container className="modeling-comparison">
      <div />
    </Container>
  );
}

ModelingComparison.propTypes = {
  property_name: string,
  options: arrayOf(
    shape({
      name: string,
      dates: shape({
        start: string,
        end: string
      }),
      four_week_funnel_averages: shape({
        app: number,
        exe: number,
        inq: number,
        tou: number,
        usv: number
      }),
      funnel: shape({
        conversions: object,
        costs: object,
        volumes: object
      }),
      investment: shape({
        acquisition: object,
        retention: object,
        total: object
      }),
      property: shape({
        cost_per_exe_vs_rent: number,
        leasing: object,
        lowest_monthly_rent: string,
        monthly_average_rent: string,
        occupancy: object
      })
    })
  ).isRequired
};

export default ModelingComparison;
