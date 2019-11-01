import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportPageChrome from "../report_page_chrome";
import ReportDateSpan from "../report_date_span";
import CommonReport from "../common_report";
import Loader from "../loader";
import "./baseline_report_page.scss";

/**
 * @class BaselineReportPage
 *
 * @classdesc Renders page chrome and contents for a single baseline report
 */
export class BaselineReportPage extends Component {
  static propTypes = {
    // report: PropTypes.object,
    // project: PropTypes.object,
  };

  renderDateSpan() {
    return <ReportDateSpan name="Baseline" dates={this.props.report.dates} />;
  }

  render() {
    const { project, report, report_links, share_info } = this.props;

    return (
      <ReportPageChrome
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

export default BaselineReportPage;
