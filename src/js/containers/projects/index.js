import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ProjectPage } from "../../components/project_page";
import BaselineReportPage from "../../components/baseline_report_page";
import MarketReportPage from "../../components/market_report_page";
import PerformanceReportPage from "../../components/performance_report_page";
import CampaignPlanPage from "../../components/campaign_plan_page";
import ModelingPage from "../../components/modeling_report_page";

class ProjectsContainer extends PureComponent {
  pickTab() {
    const { pathname } = this.props.location;
    const parts = pathname.split("/");
    const tab = parts[parts.length - 2];
    switch (tab) {
      case "baseline":
        return <BaselineReportPage {...this.props} />;
      case "performance":
        return <PerformanceReportPage {...this.props} />;
      case "modeling":
        return <ModelingPage {...this.props} />;
      case "campaign_plan":
        return <CampaignPlanPage {...this.props} />;
      case "market":
        return <MarketReportPage {...this.props} />;
      default:
        return <PropertyPage {...this.props} />;
    }
  }
  render() {
    console.log("...project container render", this.props);
    return this.pickTab();
  }
}

const mapState = state => ({
  ...state.network,
  ...state.project
});

export default withRouter(connect(mapState)(ProjectsContainer));
