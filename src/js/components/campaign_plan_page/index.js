import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportPageChrome from "../report_page_chrome";
import CampaignPlan from "../campaign_plan";
import { connect } from "react-redux";

export class CampaignPlanPage extends Component {
  static propTypes = {
    user: PropTypes.object,
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  render() {
    const { user, project, report, report_links, share_info } = this.props;

    return (
      <ReportPageChrome
        user={user}
        project={project}
        current_report_name="campaign_plan"
        report_links={report_links}
        share_info={share_info}
      >
        <CampaignPlan {...report} />
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
export default connect(mapState)(CampaignPlanPage);
