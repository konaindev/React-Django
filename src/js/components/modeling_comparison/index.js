import React from "react";
import { string, number, object, arrayOf, shape } from "prop-types";
import { convertToKebabCase } from "../../utils/misc";
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
    }
  ];

  // dynamically create columns based on available reports
  for (let report of options) {
    const accessor = convertToKebabCase(report.name);
    const column = {
      Header: report.name,
      accessor: accessor,
      Cell: CellRenderer
    };

    // Make sure that run rate model is always shown first
    if (accessor.indexOf("run-rate") > -1 && reactTableColumns.length > 1) {
      const rest = reactTableColumns.slice(1);
      reactTableColumns = [reactTableColumns[0], column, ...rest];
    } else {
      reactTableColumns.push(column);
    }
  }

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
