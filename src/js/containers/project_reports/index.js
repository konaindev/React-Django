import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ProjectReportPage from "../../components/project_report_page";
import { projectReports as actions } from "../../redux_base/actions";
import renderWrapper from "../shared/base_container";

class ProjectReportsContainer extends PureComponent {
  state = {
    prevFetchingReports: true,
    prevReportType: null,
    prevReportSpan: null
  };

  componentDidMount() {
    const { projectId } = this.props.match.params;

    this.props.dispatch(actions.requestProject(projectId));
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { projectId, reportType, reportSpan } = nextProps.match.params;
    let newState = {};

    if (reportType === "overview") {
      newState["prevFetchingReports"] = false;
      newState["reportType"] = reportType;
      newState["prevReportSpan"] = null;
      nextProps.dispatch(actions.stopFetchingReports());
      return newState;
    }

    if (state.prevFetchingReports && !nextProps.fetchingReports) {
      newState["prevFetchingReports"] = false;
      // data arrived, now "state.reportType" matches to the "props.report"
      newState["reportType"] = reportType;
      newState["reportSpan"] = reportSpan;

      return newState;
    }

    if (
      reportType !== state.prevReportType ||
      reportSpan !== state.prevReportSpan
    ) {
      newState["prevFetchingReports"] = true;
      newState["prevReportType"] = reportType;
      newState["prevReportSpan"] = reportSpan;
      nextProps.dispatch(
        actions.requestReports({ projectId, reportType, reportSpan })
      );
      return newState;
    }

    return null;
  }

  render() {
    const { reportType, reportSpan } = this.state;
    const { fetchingReports, project, report, share_info } = this.props;
    return renderWrapper(
      <ProjectReportPage
        share_info={share_info}
        project={project}
        report={report}
        reportType={reportType}
        reportSpan={reportSpan}
        fetchingReports={fetchingReports}
        historyPush={this.props.history.push}
        isAddTagInput={this.props.isAddTagInput}
        dispatch={this.props.dispatch}
      />
    );
  }
}

const mapState = state => ({
  project: state.projectReports.project,
  report: state.projectReports.reports,
  // fetchingProject: state.projectReports.fetchingProject,
  fetchingReports: state.projectReports.fetchingReports,
  isAddTagInput: state.projectReports.isAddTagInput
});

export default withRouter(connect(mapState)(ProjectReportsContainer));
