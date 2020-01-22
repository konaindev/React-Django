import React, { Component } from "react";
import PropTypes from "prop-types";

import AcquisitionFunnelReport from "../acquisition_funnel_report";
import BaselineComparisonMatrix from "../baseline_comparison_matrix";
import CampaignInvestmentReport from "../campaign_investment_report";
import Container from "../container";
import LeasingPerformanceReport from "../leasing_performance_report";
import FunnelPerformanceAnalysis from "../funnel_performance_analysis";

import "./common_report.scss";

/**
 * @class CommonReport
 *
 * @classdesc Renders a full common report from the underlying `report` data
 * A "common" report contains the leasing, campaign, and acquisition funnel
 * sections that are expected in baseline reports, performance reports,
 * and modeling reports.
 */
export default class CommonReport extends Component {
  static propTypes = {
    dateSpan: PropTypes.node,
    report: PropTypes.object.isRequired,
    type: PropTypes.oneOf(["baseline", "performance"]).isRequired
  };

  render() {
    const { dateSpan, report, type, reportType } = this.props;
    return (
      <Container className="common-report">
        <LeasingPerformanceReport
          report={report}
          sectionItems={dateSpan}
          type={type}
        />
        <CampaignInvestmentReport report={report} />
        <AcquisitionFunnelReport report={report} type={type} />
        {reportType === "baseline" && <FunnelPerformanceAnalysis {...report} />}
        {type === "baseline" && !!report?.competitors?.length && (
          <BaselineComparisonMatrix report={report} />
        )}
      </Container>
    );
  }
}
