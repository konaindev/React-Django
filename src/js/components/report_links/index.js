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
    reportLinks: PropTypes.object.isRequired,
    currentReportType: PropTypes.string.isRequired
  };

  renderLink = (reportTitle, reportType, reportLink) => {
    const itemClass = cx(
      {
        selected: reportType == this.props.currentReportType
      },
      reportLink == null ? "disabled" : "enabled"
    );

    return (
      <li key={reportType} className={itemClass}>
        <Link to={reportLink?.url || "#"}>{reportTitle}</Link>
      </li>
    );
  };

  render() {
    const { reportLinks } = this.props;

    return (
      <div className="project-report-links">
        <ul>
          {this.renderLink("Baseline", "baseline", reportLinks.baseline)}
          {this.renderLink("Market Analysis", "market", reportLinks.market)}
          {this.renderLink("Modeling", "modeling", reportLinks.modeling)}
          {reportLinks.campaign_plan &&
            this.renderLink(
              "Campaign Plan",
              "campaign_plan",
              reportLinks.campaign_plan
            )}
          {this.renderLink(
            "Performance",
            "performance",
            reportLinks.performance?.[0]
          )}
        </ul>
      </div>
    );
  }
}
