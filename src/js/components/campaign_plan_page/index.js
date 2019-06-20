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
    return (
      <ReportPageChrome
        project={this.props.project}
        current_report_name="campaign_plan"
        report_links={this.props.report_links}
      >
        <CampaignPlan {...this.props.report} />
      </ReportPageChrome>
    );
  }
}
