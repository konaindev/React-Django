import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ProjectReportPage from "../../components/project_report_page";
import {
  projectOverallRequest,
  projectReportsRequest
} from "../../redux_base/actions";

// @TODO: delete the following components and add stories and tests to "project_report_page"
// import BaselineReportPage from "../../components/baseline_report_page";
// import MarketReportPage from "../../components/market_report_page";
// import PerformanceReportPage from "../../components/performance_report_page";
// import CampaignPlanPage from "../../components/campaign_plan_page";
// import ModelingPage from "../../components/modeling_report_page";

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

    return <ProjectReportPage {...this.props} reportType={reportType} />;
  }
}

const mapState = state => ({
  ...state.network,
  ...state.project,
  project: state.projectReports.project,
  report: state.projectReports.reports,
  loadingProject: state.projectReports.loadingProject,
  loadingReports: state.projectReports.loadingReports
});

export default withRouter(connect(mapState)(ProjectsContainer));
