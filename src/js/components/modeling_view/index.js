import React, { Component } from "react";
import PropTypes from "prop-types";

import ButtonGroup from "../button_group";
import Container from "../container";
import CommonReport from "../common_report";
import ReportDateSpan from "../report_date_span";
import "./modeling_view.scss";

export class ModelingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeReportIndex: 0
    };
  }

  handleSetActiveReportIndex = index => {
    this.setState({ activeReportIndex: index });
  };

  getActiveReport() {
    return this.props.options[this.state.activeReportIndex];
  }

  renderActiveDateSpan() {
    const activeReport = this.getActiveReport();
    return (
      <ReportDateSpan name={activeReport.name} dates={activeReport.dates} />
    );
  }

  render() {
    const subnavOptions = this.props.options.map((report, index) => ({
      label: report.name,
      value: index
    }));

    return (
      <div className="page modeling-view">
        <Container>
          <div className="modeling-view__subnav">
            <ButtonGroup
              onChange={this.handleSetActiveReportIndex}
              value={this.state.activeReportIndex}
              options={subnavOptions}
            />
          </div>
        </Container>
        <CommonReport
          report={this.getActiveReport()}
          dateSpan={this.renderActiveDateSpan()}
        />
      </div>
    );
  }
}

export default ModelingView;
