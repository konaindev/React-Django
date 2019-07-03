import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportPageChrome from "../report_page_chrome";
import PerformanceReportSpanDropdown from "../performance_report_span_dropdown";
import CommonReport from "../common_report";
import { connect } from "react-redux";

/**
 * @class PerformanceReportPage
 *
 * @classdesc Renders page chrome and contents for a single performance report
 */
export class PerformanceReportPage extends Component {
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
    const { project, report, report_links, share_info } = this.props;

    return (
      <ReportPageChrome
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

export default connect(x => x)(PerformanceReportPage);
