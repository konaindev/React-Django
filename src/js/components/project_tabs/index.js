import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportSpanDropdown from "../report_span_dropdown";

/**
 * @description Top-level project tabs
 */
export class ProjectTabs extends Component {
  static propTypes = {
    current_report_link: PropTypes.object.isRequired,
    report_links: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  render() {
    return (
      <div className="k-tabs-container">
        <ul>
          <li className="selected">Performance</li>
          {/* <li>Model</li>
          <li>Market</li>
          <li>Team</li> */}
          <li className="absolute pin-r">
            <ReportSpanDropdown
              current_report_link={this.props.current_report_link}
              report_links={this.props.report_links}
            />
          </li>
        </ul>
        <hr className="k-divider k-pin-above-top" />
      </div>
    );
  }
}
