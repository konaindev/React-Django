import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _get from "lodash/get";

import { ProjectPage } from "../../components/project_page";
import BaselineReportPage from "../../components/baseline_report_page";
import MarketReportPage from "../../components/market_report_page";
import PerformanceReportPage from "../../components/performance_report_page";
import CampaignPlanPage from "../../components/campaign_plan_page";
import ModelingPage from "../../components/modeling_report_page";
import { projectOverallRequest } from "../../redux_base/actions";

class ProjectsContainer extends PureComponent {
  componentWillMount() {
    const publicId = _get(this.props.match, "params.publicId");
    this.props.dispatch(projectOverallRequest(publicId));
  }

  pickTab() {
    const { pathname } = this.props.location;
    const parts = pathname.split("/");

    let tab = null;
    if (parts.length < 6) {
      tab = parts[parts.length - 2];
    } else {
      tab = parts[parts.length - 3];
    }
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
        return (
          <MarketReportPage
            {...Object.assign({}, this.props, this.props.hell.market)}
          />
        );
      default:
        return <BaselineReportPage {...this.props} />;
    }
  }
  render() {
    return this.pickTab();
  }
}

const mapState = state => {
  let newState = {
    ...state.network,
    ...state.project,
    project: state.projectReports.overall,
    user: state.user,
    hell: {
      market: state.market
    },
    kpi: state.kpi
  };
  console.log("project CONTAINER map state", state.projectReports, newState);
  return newState;
};

export default withRouter(connect(mapState)(ProjectsContainer));
