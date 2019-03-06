import React from "react";
import PropTypes from "prop-types";

import AcquisitionFunnelReport from "../acquisition_funnel_report";
import CampaignInvestmentReport from "../campaign_investment_report";
import Container from "../container";
import LeasingPerformanceReport from "../leasing_performance_report";
import SectionHeader from "../section_header";
import "./modeling_view.scss";

export const ModelingView = ({ report }) => (
  <Container className="modeling-view">
    <LeasingPerformanceReport report={report} />
    <CampaignInvestmentReport report={report} />
    <AcquisitionFunnelReport report={report} />
  </Container>
);

export default ModelingView;
