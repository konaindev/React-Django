import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ReportLinks from "../report_links";
import ShareToggle from "../share_toggle";
import ProjectLink from "../project_link";
import Loader from "../loader";
import ReportDateSpan from "../report_date_span";
import PerformanceReportSpanDropdown from "../performance_report_span_dropdown";
import CommonReport from "../common_report";
import TotalAddressableMarket from "../total_addressable_market";
import ModelingView from "../modeling_view";
import CampaignPlan from "../campaign_plan";

import "./project_report_page.scss";

const DEFAULT_IMAGE_URL =
  "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png";

export class ProjectReportPage extends Component {
  static propTypes = {
    // project: PropTypes.object.isRequired,
    current_report_name: PropTypes.string.isRequired,
    report_links: PropTypes.object.isRequired,
    share_info: PropTypes.object,
    topItems: PropTypes.node,
    children: PropTypes.node.isRequired,
    backUrl: PropTypes.string,
    loadingProject: PropTypes.bool,
    loadingReports: PropTypes.bool
  };

  static defaultProps = {
    backUrl: "/dashboard"
  };

  renderSubheader = () => {
    const {
      project,
      current_report_name,
      report_links,
      share_info,
      backUrl,
      reportType
    } = this.props;

    let projectImage = DEFAULT_IMAGE_URL;
    if (project && project.building_image) {
      projectImage = project.building_image[2];
    }

    return (
      <section className="report-page-subheader">
        <div className="container">
          <div className="subheader-project-link">
            <ProjectLink
              name={project.name}
              url={backUrl}
              imageUrl={projectImage}
              health={project.health}
            />
          </div>
          <div className="subheader-report-tabs">
            <ReportLinks
              current_report_name={current_report_name}
              report_links={report_links}
            />
            {share_info != null && (
              <ShareToggle
                {...share_info}
                current_report_name={current_report_name}
                update_endpoint={project.update_endpoint}
              />
            )}
          </div>
        </div>
      </section>
    );
  };

  renderReportContent = () => {
    const {
      reportType,
      report,
      current_report_link,
      report_links
    } = this.props;

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
        return (
          <>
            <ModelingView {...report} />
            {""}
          </>
        );
      case "campaign_plan":
        return <CampaignPlan {...report} />;
      case "performance":
        return (
          <CommonReport type="performance" report={report} dateSpan={null} />
        );
        return (
          <CommonReport
            type="performance"
            report={report}
            dateSpan={
              <PerformanceReportSpanDropdown
                current_report_link={this.props.current_report_link}
                report_links={report_links.performance}
              />
            }
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { loadingProject, loadingReports } = this.props;

    return (
      <div className="project-report-page">
        {!loadingProject && this.renderSubheader()}
        {loadingReports ? <Loader isVisible /> : this.renderReportContent()}
      </div>
    );
  }
}

export default ProjectReportPage;
