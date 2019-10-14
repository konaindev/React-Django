import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { Link } from "react-router-dom";
import "./report_links.scss";

/**
 * @class ReportLinks
 *
 * @classdesc Renders the top-level report links for any report page.
 */
export default class ReportLinks extends Component {
  static propTypes = {
    current_report_name: PropTypes.string.isRequired,
    report_links: PropTypes.object.isRequired
  };

  renderLink(report_friendly_name, report_name, optional_report_link) {
    const names = cn(
      {
        selected: report_name == this.props.current_report_name
      },
      optional_report_link == null ? "disabled" : "enabled"
    );
    return (
      <li className={names} data-url={optional_report_link?.url || "#"}>
        <Link
          style={{ color: "inherit", textDecoration: "inherit" }}
          to={
            optional_report_link && optional_report_link.url
              ? optional_report_link.url
              : "#"
          }
        >
          {report_friendly_name}
        </Link>
      </li>
    );
  }

  render() {
    // TODO CONSIDER: report_links should probably contain friendly names, too?
    return (
      <div className="project-report-links">
        <ul>
          {this.renderLink(
            "Baseline",
            "baseline",
            this.props.report_links.baseline
          )}
          {this.props.report_links.market &&
            this.renderLink(
              "Market Analysis",
              "market",
              this.props.report_links.market
            )}
          {this.renderLink(
            "Modeling",
            "modeling",
            this.props.report_links.modeling
          )}
          {this.props.report_links.campaign_plan &&
            this.renderLink(
              "Campaign Plan",
              "campaign_plan",
              this.props.report_links.campaign_plan
            )}
          {this.renderLink(
            "Performance",
            "performance",
            this.props.report_links.performance?.[0]
          )}
        </ul>
      </div>
    );
  }
}
