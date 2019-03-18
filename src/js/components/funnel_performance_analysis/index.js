import React from "react";
import { string, number, object, array, arrayOf, shape } from "prop-types";
import ReactTable from "react-table";

import "./funnel_performance_analysis.scss";
import processData from "./data_processor";
import Container from "../container";
import SectionHeader from "../section_header";
import Panel from "../panel";
import ButtonGroup from "../button_group";

export class FunnelPerformanceAnalysis extends React.Component {
  constructor(props) {
    super(props);

    const { columns, volumeRows, conversionRows } = processData(
      props.funnelHistory
    );

    this.state = {
      viewMode: "monthly",
      columns,
      volumeRows,
      conversionRows
    };

    this.buttonGroupOptions = [
      {
        value: "monthly",
        label: "Monthly"
      },
      {
        value: "weekly",
        label: "Weekly"
      }
    ];
  }

  static Table = ({ data, columns, viewMode }) => {
    let tableColumns = columns.map(c => ({
      ...c,
      minWidth: getCellMinWidth(c.accessor, viewMode),
      Cell: props => <CellRenderer {...props} viewMode={viewMode} />
    }));

    return (
      <ReactTable
        data={data}
        columns={tableColumns}
        className="analysis__table-wrapper"
        defaultPageSize={data.length}
        showPagination={false}
        sortable={false}
        resizable={false}
        viewMode={viewMode}
      />
    );
  };

  handleChangeViewMode = viewMode => {
    this.setState({ viewMode });
  };

  render() {
    const { viewMode, columns, volumeRows, conversionRows } = this.state;

    return (
      <Container className="funnel-performance-analysis">
        <SectionHeader title="Funnel Performance Analysis" />

        <Panel>
          <div className="analysis__panel-header">
            <ButtonGroup
              onChange={this.handleChangeViewMode}
              value={viewMode}
              options={this.buttonGroupOptions}
            />
          </div>

          <p className="analysis__table-intro">Volume of Activity</p>
          <FunnelPerformanceAnalysis.Table
            data={volumeRows}
            columns={columns}
            viewMode={viewMode}
          />

          <p className="analysis__table-intro">Conversion Rate</p>
          <FunnelPerformanceAnalysis.Table
            data={conversionRows}
            columns={columns}
            viewMode={viewMode}
          />
        </Panel>
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

function getCellMinWidth(accessor, viewMode) {
  if (accessor === "label") {
    return 140;
  }

  if (viewMode === "monthly") {
    return 84;
  }

  return 78;
}

function CellRenderer({ value, original, column, viewMode }) {
  if (column.id === "label") {
    return <span>{value}</span>;
  }

  if (viewMode === "monthly") {
    return <MonthlyCell cellData={value.monthly} rowData={original} />;
  }

  if (viewMode === "weekly") {
    return <WeeklyCell cellData={value.weekly} rowData={original} />;
  }
}

function MonthlyCell(props) {
  return <span />;
}

function WeeklyCell(props) {
  return <span />;
}

export default FunnelPerformanceAnalysis;
