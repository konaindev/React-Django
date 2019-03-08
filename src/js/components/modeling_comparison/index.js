import React from "react";
import { string, number, object, arrayOf, shape } from "prop-types";
import ReactTable from "react-table";
import "react-table/react-table.css";

import serialize from "./serializer";
import "./modeling_comparison.scss";
import Container from "../container";

const getTrProps = (state, { original: row }, column) => {
  let classes = [];

  if (row.highlight) {
    classes.push("accent");
  }
  if (row.isChildren) {
    classes.push("children");
  }

  return {
    className: classes.join(" ")
  };
};

export function ModelingComparison({ property_name, options }) {
  const { rows } = serialize(options);

  console.log(rows);

  let reactTableColumns = [
    {
      Header: "",
      accessor: "label",
      Cell: row => (
        <>
          {row.original.isChildren && <span>{"¬ "}</span>}
          {row.value}
        </>
      )
    },
    {
      Header: "Run Rate",
      accessor: "Run Rate"
    },
    {
      Header: "Schedule Driven",
      accessor: "Schedule Driven"
    },
    {
      Header: "Investment Driven",
      accessor: "Investment Driven"
    }
  ];

  return (
    <Container className="modeling-comparison" style={{ height: "100%" }}>
      <ReactTable
        data={rows}
        columns={reactTableColumns}
        className=""
        defaultPageSize={rows.length}
        showPagination={false}
        sortable={false}
        resizable={false}
        getTrProps={getTrProps}
      />
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
