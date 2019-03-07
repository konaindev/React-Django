import React from "react";
import { string, number, object, arrayOf, shape } from "prop-types";
import Table from "rc-table";

import serialize from "./serializer";
import "./modeling_comparison.scss";

export function ModelingComparison({ property_name, options }) {
  const { rows } = serialize(options);

  console.log(rows);

  let columns = [
    {
      title: "",
      dataIndex: "label",
      key: "label"
    },
    {
      title: "Run Rate",
      dataIndex: "Run Rate",
      key: "run-rate"
    },
    {
      title: "Schedule Driven",
      dataIndex: "Schedule Driven",
      key: "schedule-driven"
    },
    {
      title: "Investment Driven",
      dataIndex: "Investment Driven",
      key: "investment-driven"
    }
  ];

  return (
    <Table
      expandIconAsCell
      columns={columns}
      data={rows}
      rowKey={record => record.id}
    />
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
      }).isRequired,
      funnel: shape({
        conversions: object.isRequired,
        costs: object.isRequired,
        volumes: object.isRequired
      }).isRequired,
      investment: shape({
        acquisition: shape({
          estimated_revenue_gain: string,
          expenses: object.isRequired,
          romi: number,
          total: string
        }).isRequired,
        retention: shape({
          estimated_revenue_gain: string,
          expenses: object.isRequired,
          romi: number,
          total: string
        }).isRequired,
        total: object.isRequired
      }).isRequired,
      property: shape({
        cost_per_exe_vs_rent: number,
        leasing: object.isRequired,
        lowest_monthly_rent: string,
        monthly_average_rent: string,
        occupancy: object.isRequired
      }).isRequired
    })
  ).isRequired
};

export default ModelingComparison;
