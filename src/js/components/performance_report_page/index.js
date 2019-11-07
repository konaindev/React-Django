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
    user: PropTypes.object,
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    let camp_start = this.props.project?.campaign_start;
    let camp_end = this.props.project?.campaign_end;
    this.campaignRange = {
      campaign_start: camp_start,
      campaign_end: camp_end
    };
  }

  renderDateSpan() {
    return (
      <PerformanceReportSpanDropdown
        start_date={this.props.report.dates.start}
        end_date={this.props.report.dates.end}
        preset={this.props.current_report_link.description.preset}
        campaignRange={this.campaignRange}
        onChange={this.onChange}
      />
    );
  }

  generateReportLink = preset => {
    return (
      "/projects/" + this.props.project.public_id + "/performance/" + preset
    );
  };

  onChange = (preset, ...args) => {
    var window;
    if (preset !== "custom") {
      window = this.generateReportLink(preset);
    } else if (preset === "custom") {
      window = this.generateReportLink(args[0]);
    }
    document.location = window;
  };

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

const mapState = state => {
  return {
    ...state.general,
    ...state.network
  };
};
export default connect(mapState)(PerformanceReportPage);
