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
    const { project, report, report_links, share_info } = this.props;

    return (
      <ReportPageChrome
        project={project}
        current_report_name="modeling"
        report_links={report_links}
        share_info={share_info}
      >
        <ModelingView {...report} />{" "}
      </ReportPageChrome>
    );
  }
}
