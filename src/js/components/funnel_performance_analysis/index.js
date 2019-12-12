import React from "react";
import { string, number, object, array, arrayOf, shape } from "prop-types";

import "./funnel_performance_analysis.scss";
import processData from "./data_processor";
import FunnelPanelHeader from "./funnel_panel_header";
import FunnelAnalysisTable from "./funnel_analysis_table";

import SectionHeader from "../section_header";
import Panel from "../panel";

export class FunnelPerformanceAnalysis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataNotAvailable: true,
      viewMode: "monthly",
      prevFunnelHistory: null
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    let newState = {};

    // detect new prop "funnel_history", on which this component focuses mainly
    if (nextProps.funnel_history !== state.prevFunnelHistory) {
      newState["prevFunnelHistory"] = nextProps.funnel_history;
      newState["dataNotAvailable"] = nextProps.funnel_history === null;
      let { columns, volumeRows, conversionRows } = processData(
        nextProps.funnel_history || []
      );
      newState["columns"] = columns;
      newState["volumeRows"] = volumeRows;
      newState["conversionRows"] = conversionRows;
      return newState;
    }

    return null;
  }

  handleChangeViewMode = viewMode => {
    this.setState({ viewMode });
  };

  render() {
    const {
      dataNotAvailable,
      viewMode,
      columns,
      volumeRows,
      conversionRows
    } = this.state;

    if (dataNotAvailable) {
      return <div />;
    }

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
  )
};

export default FunnelPerformanceAnalysis;
