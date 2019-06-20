import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportPageChrome from "../report_page_chrome";
import ModelingView from "../modeling_view";

export default class ModelingReportPage extends Component {
  static propTypes = {
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  render() {
    return (
      <ReportPageChrome
        project={this.props.project}
        current_report_name="modeling"
        report_links={this.props.report_links}
      >
        <ModelingView {...this.props.report} />{" "}
      </ReportPageChrome>
    );
  }
}
