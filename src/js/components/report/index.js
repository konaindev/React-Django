import React, { Component } from "react";
import PropTypes from "prop-types";

import LeasingPerformanceReport from '../leasing_performance_report';
import CampaignInvestmentReport from '../campaign_investment_report';
import AcquisitionFunnelReport from '../acquisition_funnel_report';

/**
 * @class Report
 *
 * @classdesc Renders a full progress report from the underlying `report` data
 */
class Report extends Component {
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
