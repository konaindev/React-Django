import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { Link } from "react-router-dom";

import "./report_links.scss";

/**
 * @class ReportLinks
 *
 * @classdesc Renders the top-level report links for any report page.
 */
export default class ReportLinks extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    currentReportType: PropTypes.string.isRequired
  };

  reportTabs = [
    {
      title: "Baseline",
      reportType: "baseline"
    },
    {
      title: "Market Analysis",
      reportType: "market"
    },
    {
      title: "Modeling",
      reportType: "modeling"
    },
    {
      title: "Campaign Plan",
      reportType: "campaign_plan"
    },
    {
      title: "Performance",
      reportType: "performance"
    }
  ];

  isReportEnabled = reportType => {
    const fieldMap = {
      baseline: "is_baseline_report_public",
      market: "is_tam_public",
      modeling: "is_modeling_public",
      campaign_plan: "is_campaign_plan_public",
      performance: "is_performance_report_public"
    };

    const { project } = this.props;
    const field = fieldMap[reportType];

    return project[field] === true;
  };

  getReportUrl = reportType => {
    if (false === this.isReportEnabled(reportType)) {
      return "#";
    }

    const { project } = this.props;
    if (reportType === "performance") {
      // @FIXME
      return `/projects/${project.public_id}/performance/report_span_0/`;
    } else {
      return `/projects/${project.public_id}/${reportType}/`;
    }
  };

  renderTabItem = (reportTitle, reportType) => {
    const reportLink = this.getReportUrl(reportType);
    const itemClass = cx(
      {
        selected: reportType == this.props.currentReportType
      },
      reportLink == "#" ? "disabled" : "enabled"
    );

    return (
      <li key={reportType} className={itemClass} data-url={reportLink}>
        <Link to={reportLink}>{reportTitle}</Link>
      </li>
    );
  };

  render() {
    return (
      <div className="project-report-links">
        <ul>
          {this.reportTabs.map(tab => {
            return this.renderTabItem(tab.title, tab.reportType);
          })}
        </ul>
      </div>
    );
  }
}
