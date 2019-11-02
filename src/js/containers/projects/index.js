import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _get from "lodash/get";

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
  state = {};

  componentDidMount() {
    this.setState({
      reportType: null,
      projectData: false,
      reportData: false,
      loadingReports: true
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { projectId, reportType, reportSpan } = nextProps.match.params;
    let newState = {};

    if (!nextProps.loadingReports) {
      newState["loadingReports"] = false;
    }

    if (nextProps.project !== prevState.projectData) {
      newState["projectData"] = nextProps.project;
    }

    if (nextProps.report !== prevState.reportData) {
      newState["reportData"] = nextProps.report;
      newState["reportType"] = reportType;
    }

    if (projectId !== prevState.projectId) {
      nextProps.dispatch(projectOverallRequest(projectId));
      newState["projectId"] = projectId;
    }

    if (reportType !== prevState.reportType) {
      nextProps.dispatch(
        projectReportsRequest(projectId, reportType, reportSpan)
      );
      newState["loadingReports"] = true;
    }

    if (Object.keys(newState).length > 0) {
      return newState;
    } else {
      return null;
    }
  }

  fetchProjectData(projectId) {
    this.props.dispatch(projectOverallRequest(projectId));
  }

  render() {
    const { reportType, projectData, reportData, loadingReports } = this.state;

    return (
      <ProjectReportPage
        share_info={this.props.share_info}
        project={projectData}
        report={reportData}
        reportType={reportType}
        loadingReports={loadingReports}
      />
    );
  }
}

const mapState = state => ({
  project: state.projectReports.project,
  report: state.projectReports.reports,
  loadingProject: state.projectReports.loadingProject,
  loadingReports: state.projectReports.loadingReports
});

export default withRouter(connect(mapState)(ProjectsContainer));
