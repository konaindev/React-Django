import React from "react";
import { string, number, object, array, arrayOf, shape } from "prop-types";

import "./funnel_performance_analysis.scss";
import processData from "./data_processor";
import FunnelPanelHeader from "./funnel_panel_header";
import FunnelAnalysisTable from "./funnel_analysis_table";

import SectionHeader from "../section_header";
import Panel from "../panel";
import { formatNumber, formatPercent } from "../../utils/formatters";

export class FunnelPerformanceAnalysis extends React.Component {
  constructor(props) {
    super(props);

    const { columns, volumeRows, conversionRows } = processData(
      props.funnel_history
    );

    this.state = {
      dataNotAvailable: props.funnel_history == null,
      viewMode: "monthly",
      columns,
      volumeRows,
      conversionRows
    };
  }

  handleChangeViewMode = viewMode => {
    this.setState({ viewMode });
  };

  render() {
    if (this.state.dataNotAvailable) {
      return <div />;
    }

    const { viewMode, columns, volumeRows, conversionRows } = this.state;

    return (
      <div className="funnel-performance-analysis">
        <SectionHeader title="Funnel Performance Analysis" />

        <Panel>
          <FunnelPanelHeader
            viewMode={viewMode}
            onChangeViewMode={this.handleChangeViewMode}
          />

          <p className="analysis__table-intro">Volume of Activity</p>
          <FunnelAnalysisTable
            data={volumeRows}
            columns={columns}
            viewMode={viewMode}
          />

          <p className="analysis__table-intro">Conversion Rate</p>
          <FunnelAnalysisTable
            data={conversionRows}
            columns={columns}
            viewMode={viewMode}
          />
        </Panel>
      </div>
    );
  }
}

FunnelPerformanceAnalysis.propTypes = {
  funnel_history: arrayOf(
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

export default FunnelPerformanceAnalysis;
