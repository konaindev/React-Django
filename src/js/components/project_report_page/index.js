import React, { Component } from "react";
import PropTypes from "prop-types";

import Loader from "../loader";
import ReportLinks from "../report_links";
import ShareToggle from "../share_toggle";
import ProjectLink from "../project_link";
// date range picker
import ReportDateSpan from "../report_date_span";
import PerformanceReportSpanDropdown from "../performance_report_span_dropdown";
// report content
import CommonReport from "../common_report";
import TotalAddressableMarket from "../total_addressable_market";
import ModelingView from "../modeling_view";
import CampaignPlan from "../campaign_plan";
import UserIconList from "../user_icon_list";

import "./project_report_page.scss";

const DEFAULT_IMAGE_URL =
  "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png";

export class ProjectReportPage extends Component {
  static propTypes = {
    project: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    report: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    reportType: PropTypes.string,
    reportSpan: PropTypes.string,
    share_info: PropTypes.object,
    backUrl: PropTypes.string,
    fetchingReports: PropTypes.bool,
    historyPush: PropTypes.func.isRequired
  };

  static defaultProps = {
    backUrl: "/dashboard"
  };

  renderSubheader = () => {
    const { project, share_info, backUrl, reportType } = this.props;

    let projectImage = DEFAULT_IMAGE_URL;
    if (project && project.building_image) {
      projectImage = project.building_image[2];
    }

    return (
      <section className="project-report-page__subheader">
        <div className="container">
          <div className="project-report-page__subnav">
            <div>
              <ProjectLink
                name={project.name}
                url={backUrl}
                imageUrl={projectImage}
                health={project.health}
              />
            </div>
            <div>
              <UserIconList
                theme="project"
                tooltipPlacement="bottom"
                tooltipTheme="dark"
                users={project.members}
              />
            </div>
          </div>
          <div className="subheader-report-tabs">
            <ReportLinks
              reportLinks={project.report_links}
              currentReportType={reportType}
            />
            {share_info != null && (
              <ShareToggle
                {...share_info}
                current_report_name={reportType}
                update_endpoint={project.update_endpoint}
              />
            )}
          </div>
        </div>
      </section>
    );
  };

  renderReportContent = () => {
    const { reportType, reportSpan, report, project } = this.props;

    switch (reportType) {
      case "baseline":
        return (
          <CommonReport
            type="baseline"
            report={report}
            dateSpan={<ReportDateSpan name="Baseline" dates={report.dates} />}
          />
        );
      case "market":
        return <TotalAddressableMarket {...report} />;
      case "modeling":
        return <ModelingView {...report} />;
      case "campaign_plan":
        return <CampaignPlan {...report} />;
      case "performance":
        return (
          <CommonReport
            type="performance"
            report={report}
            dateSpan={
              <PerformanceReportSpanDropdown
                start_date={report.dates.start}
                end_date={report.dates.end}
                preset={reportSpan}
                campaignRange={{
                  campaign_start: project.campaign_start,
                  campaign_end: project.campaign_end
                }}
                onChange={this.handleReportSpanChange}
              />
            }
          />
        );
      default:
        return null;
    }
  };

  handleReportSpanChange = (preset, ...args) => {
    const { project } = this.props;
    const reportSpan = preset !== "custom" ? preset : args[0];
    this.props.historyPush(
      `/projects/${project.public_id}/performance/${reportSpan}/`
    );
  };

  render() {
    const { fetchingReports, project, report } = this.props;

    return (
      <div className="project-report-page">
        {project && this.renderSubheader()}
        <section className="project-report-page__content">
          {fetchingReports && <Loader isVisible />}
          {project && report && this.renderReportContent()}
        </section>
      </div>
    );
  }
}

export default ProjectReportPage;
