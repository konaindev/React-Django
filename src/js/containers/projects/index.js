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
import {
  projectOverallRequest,
  projectReportsRequest
} from "../../redux_base/actions";

class ProjectsContainer extends PureComponent {
  componentWillMount() {
    const { params } = this.props.match;
    const { publicId, reportType, reportSpan } = params;
    this.props.dispatch(projectOverallRequest(publicId));

    if (reportType) {
      this.props.dispatch(
        projectReportsRequest(publicId, reportType, reportSpan)
      );
    }
  }

  render() {
    const { params } = this.props.match;
    const { reportType } = params;

    const reportPageHub = {
      baseline: BaselineReportPage,
      performance: PerformanceReportPage,
      modeling: ModelingPage,
      campaign_plan: CampaignPlanPage,
      market: MarketReportPage
    };
    const ReportPage = reportPageHub[reportType];

    return <ReportPage {...this.props} />;
  }
}

const mapState = state => {
  let newState = {
    ...state.network,
    ...state.project,
    project: state.projectReports.project,
    report: state.projectReports.reports,
    loadingProject: state.projectReports.loadingProject,
    loadingReports: state.projectReports.loadingReports,
    user: state.user
  };
  console.log("project CONTAINER map state", state.projectReports, newState);
  return newState;
};

export default withRouter(connect(mapState)(ProjectsContainer));
