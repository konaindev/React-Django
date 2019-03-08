import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportPageChrome from "../report_page_chrome";
import PerformanceReportSpanDropdown from "../performance_report_span_dropdown";
import CommonReport from "../common_report";

/**
 * @class PerformanceReportPage
 *
 * @classdesc Renders page chrome and contents for a single performance report
 */
export default class PerformanceReportPage extends Component {
  static propTypes = {
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  renderDateSpan() {
    return (
      <PerformanceReportSpanDropdown
        current_report_link={this.props.current_report_link}
        report_links={this.props.report_links.performance}
      />
    );
  }

  render() {
    return (
      <ReportPageChrome
        project={this.props.project}
        current_report_name="performance"
        report_links={this.props.report_links}
      >
        <CommonReport
          report={this.props.report}
          dateSpan={this.renderDateSpan()}
          type="performance"
        />
      </ReportPageChrome>
    );
  }
}
