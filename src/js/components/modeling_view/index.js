import React, { Component } from "react";
import PropTypes from "prop-types";

import ButtonGroup from "../button_group";
import Container from "../container";
import CommonReport from "../common_report";
import ModelingComparison from "../modeling_comparison";
import ReportDateSpan from "../report_date_span";
import "./modeling_view.scss";

export class ModelingView extends Component {
  static propTypes = {
    property_name: PropTypes.string,
    options: PropTypes.array
  };

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
    const { options } = this.props;
    const { activeReportIndex } = this.state;
    const subnavOptions = [
      ...options.map((report, index) => ({
        label: report.name,
        value: index
      })),
      {
        label: "Compare Models",
        value: "compare"
      }
    ];

    return (
      <div className="page modeling-view">
        <Container>
          <div className="modeling-view__subnav">
            <ButtonGroup
              onChange={this.handleSetActiveReportIndex}
              value={activeReportIndex}
              options={subnavOptions}
            />
          </div>
        </Container>
        {activeReportIndex === "compare" ? (
          <ModelingComparison {...this.props} />
        ) : (
          <CommonReport
            report={this.getActiveReport()}
            dateSpan={this.renderActiveDateSpan()}
            type="baseline"
          />
        )}
      </div>
    );
  }
}

export default ModelingView;
