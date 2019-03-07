import React, { Component } from "react";
import PropTypes from "prop-types";

import LeasingPerformanceReport from "../leasing_performance_report";
import CampaignInvestmentReport from "../campaign_investment_report";
import AcquisitionFunnelReport from "../acquisition_funnel_report";

/**
 * @class CommonReport
 *
 * @classdesc Renders a full common report from the underlying `report` data
 * A "common" report contains the leasing, campaign, and acquisition funnel
 * sections that are expected in baseline reports, performance reports,
 * and modeling reports.
 */
export default class CommonReport extends Component {
  static propTypes = { report: PropTypes.object.isRequired };

  render() {
    return (
      <span>
        <LeasingPerformanceReport report={this.props.report} />
        <CampaignInvestmentReport report={this.props.report} />
        <AcquisitionFunnelReport report={this.props.report} />
      </span>
    );
  }
}