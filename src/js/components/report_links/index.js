import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

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
    return <li className={names}>{report_friendly_name}</li>;
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
          {this.renderLink(
            "Market Analysis",
            "market",
            this.props.report_links.market
          )}
          {this.renderLink(
            "Modeling",
            "modeling",
            this.props.report_links.modeling
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
