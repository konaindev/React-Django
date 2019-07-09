import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportPageChrome from "../report_page_chrome";
import ReportDateSpan from "../report_date_span";
import CommonReport from "../common_report";

import "./baseline_report_page.scss";

/**
 * @class BaselineReportPage
 *
 * @classdesc Renders page chrome and contents for a single baseline report
 */
export default class BaselineReportPage extends Component {
  static propTypes = {
    report: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  renderDateSpan() {
    return <ReportDateSpan name="Baseline" dates={this.props.report.dates} />;
  }

  render() {
    const { user, project, report, report_links, share_info } = this.props;

    return (
      <ReportPageChrome
        user={user}
        project={project}
        current_report_name="baseline"
        report_links={report_links}
        share_info={share_info}
      >
        <CommonReport
          report={report}
          dateSpan={this.renderDateSpan()}
          type="baseline"
        />
      </ReportPageChrome>
    );
  }
}
