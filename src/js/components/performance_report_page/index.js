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
    user: PropTypes.object.isRequired,
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
    const { user, project, report, report_links, share_info } = this.props;

    return (
      <ReportPageChrome
        user={user}
        project={project}
        current_report_name="performance"
        report_links={report_links}
        share_info={share_info}
      >
        <CommonReport
          report={report}
          dateSpan={this.renderDateSpan()}
          type="performance"
        />
      </ReportPageChrome>
    );
  }
}
