import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportPageChrome from "../report_page_chrome";
import CampaignPlan from "../campaign_plan";

export default class CampaignPlanPage extends Component {
  static propTypes = {
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  render() {
    const { project, report, report_links, share_info } = this.props;

    return (
      <ReportPageChrome
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
