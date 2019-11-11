import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportPageChrome from "../report_page_chrome";
import ModelingView from "../modeling_view";
import { connect } from "react-redux";
export class ModelingReportPage extends Component {
  static propTypes = {
    user: PropTypes.object,
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  render() {
    const {
      user,
      project,
      report,
      report_links,
      share_info,
      members
    } = this.props;

    return (
      <ReportPageChrome
        user={user}
        project={project}
        current_report_name="modeling"
        report_links={report_links}
        share_info={share_info}
        members={members}
      >
        <ModelingView {...report} />{" "}
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
export default connect(mapState)(ModelingReportPage);
