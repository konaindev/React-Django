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

import "./project_report_page.scss";

const DEFAULT_IMAGE_URL =
  "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png";

export class ProjectReportPage extends Component {
  static propTypes = {
    project: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    report: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    share_info: PropTypes.object,
    backUrl: PropTypes.string,
    loadingReports: PropTypes.bool
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
    const { reportType, report, report_links } = this.props;

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
    const { loadingReports, project, report } = this.props;

    return (
      <div className="project-report-page">
        {project && this.renderSubheader()}
        <section className="project-report-page__content">
          {loadingReports && <Loader isVisible />}
          {report && this.renderReportContent()}
        </section>
      </div>
    );
  }
}

export default ProjectReportPage;
