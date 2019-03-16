import React from "react";
import { string, number, object, array, arrayOf, shape } from "prop-types";
import ReactTable from "react-table";

import "./funnel_performance_analysis.scss";
import processData from "./data_processor";
import Container from "../container";
import SectionHeader from "../section_header";

export class FunnelPerformanceAnalysis extends React.Component {
  constructor(props) {
    super(props);

    const { columns, volumeRows, conversionRows } = processData(
      props.funnelHistory
    );

    this.state = {
      currentView: "monthly",
      columns,
      volumeRows,
      conversionRows
    };
  }

  static Table = ({ data, columns, className, currentView }) => {
    let tableColumns = columns.map(c => ({
      ...c,
      Cell: CellRenderer
    }));

    return (
      <ReactTable
        data={data}
        columns={tableColumns}
        className={className}
        defaultPageSize={data.length}
        showPagination={false}
        sortable={false}
        resizable={false}
        currentView={currentView}
      />
    );
  };

  render() {
    const { currentView, columns, volumeRows, conversionRows } = this.state;

    return (
      <Container className="funnel-performance-analysis">
        <SectionHeader title="Funnel Performance Analysis" />

        <p>Volume of Activity</p>
        <FunnelPerformanceAnalysis.Table
          data={volumeRows}
          columns={columns}
          currentView={currentView}
        />

        <p>Conversion Rate</p>
        <FunnelPerformanceAnalysis.Table
          data={conversionRows}
          columns={columns}
          currentView={currentView}
        />
      </Container>
    );
  }
}

FunnelPerformanceAnalysis.propTypes = {
  funnelHistory: arrayOf(
    shape({
      month: string,
      monthly_volumes: shape({
        usv: number,
        inq: number,
        tou: number,
        app: number,
        exe: number
      }).isRequired,
      weekly_volumes: shape({
        usv_inq: array,
        inq_tou: array,
        tou_app: array,
        app_exe: array,
        usv_exe: array
      }).isRequired,
      monthly_conversions: shape({
        usv: number,
        inq: number,
        tou: number,
        app: number,
        exe: number
      }).isRequired,
      weekly_conversions: shape({
        usv_inq: array,
        inq_tou: array,
        tou_app: array,
        app_exe: array,
        usv_exe: array
      }).isRequired,
      monthly_costs: object,
      weekly_costs: object
    })
  ).isRequired
};

function CellRenderer(props, a, b) {
  return <span>{props?.value?.monthly?.value}</span>;
}

export default FunnelPerformanceAnalysis;
