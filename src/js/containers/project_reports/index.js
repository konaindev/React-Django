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

  componentDidUpdate(nextProps, state) {
    console.log("CONTAINER NEXT PROPS", nextProps);
    console.log("CONTAINER STATE", state);
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { projectId, reportType, reportSpan } = nextProps.match.params;
    console.log("DERIVED STATE", reportType);
    console.log("PROPS", nextProps.report);
    let newState = {};

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
    // console.log("RENDER IN PROJECT WRAPPER", this.state);
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
        dispatch={this.props.dispatch}
      />
    );
  }
}

const mapState = state => ({
  project: state.projectReports.project,
  report: state.projectReports.reports,
  // fetchingProject: state.projectReports.fetchingProject,
  fetchingReports: state.projectReports.fetchingReports
});

export default withRouter(connect(mapState)(ProjectReportsContainer));
