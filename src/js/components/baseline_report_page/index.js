import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportPageChrome from "../report_page_chrome";
import CommonReport from "../common_report";

import "./baseline_report_page.scss";

/**
 * @description The full landing page for a single project report
 */
export default class BaselineReportPage extends Component {
  // TODO further define the shape of a report and a project...
  static propTypes = {
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  componentDidMount() {
    console.log("Report data", this.props.report);
  }

  render() {
    return (
      <ReportPageChrome
        project={this.props.project}
        current_report_name="baseline"
        report_links={this.props.report_links}
      >
        <CommonReport report={this.props.report} />
      </ReportPageChrome>
    );
  }
}
