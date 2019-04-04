import React from "react";
import { string, number, object, arrayOf, shape } from "prop-types";
import cn from "classnames";
import ReactTable from "react-table";

import "./modeling_comparison.scss";
import convertToTableRows from "./converter";
import Container from "../container";

const getTrProps = (state, row, column) => {
  return {
    className: cn({
      accent: row.original.highlight,
      children: row.original.isChildren
    })
  };
};

const CellRenderer = props => <div>{props.value}</div>;

export function ModelingComparison({ property_name, options }) {
  const tableRows = convertToTableRows(options);

  console.log(tableRows);

  let reactTableColumns = [
    {
      Header: "",
      accessor: "label",
      width: 400,
      Cell: row => (
        <div>
          {row.original.isChildren && <span className="row-label-icon">L</span>}
          <span className="row-label-text">{row.value}</span>
        </div>
      )
    },
    {
      Header: "Run Rate",
      accessor: "run-rate",
      Cell: CellRenderer
    },
    {
      Header: "Schedule Driven",
      accessor: "schedule-driven",
      Cell: CellRenderer
    },
    {
      Header: "Investment Driven",
      accessor: "investment-driven",
      Cell: CellRenderer
    }
  ];

  return (
    <Container className="modeling-comparison" style={{ height: "100%" }}>
      <ReactTable
        data={tableRows}
        columns={reactTableColumns}
        className=""
        defaultPageSize={tableRows.length}
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
        average_monthly_rent: string,
        occupancy: object.isRequired
      }).isRequired
    })
  ).isRequired
};

export default ModelingComparison;
