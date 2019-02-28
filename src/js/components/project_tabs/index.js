import React, { Component } from "react";
import PropTypes from "prop-types";

// XXX FIXME TODO etc -- we should *not* be pulling ReportSpanDropdown in here.
import ReportSpanDropdown from "../report_span_dropdown";
import "./project_tabs.scss";

/**
 * @description Top-level project tabs
 */
export default class ProjectTabs extends Component {
  static propTypes = {
    current_report_link: PropTypes.object.isRequired,
    report_links: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  render() {
    return (
      <div className="project-tabs">
        <ul>
          <li className="selected">Performance</li>
          {/* TODO these should be named children, etc.
          <li>Model</li>
          <li>Market</li>
          <li>Team</li> 
          
          XXX this factoring is nonsense. FIXME TODO etc. -Dave
          */}
          <li className="rightmost">
            <ReportSpanDropdown
              current_report_link={this.props.current_report_link}
              report_links={this.props.report_links}
            />
          </li>
        </ul>
        <hr className="horizontal-divider above-top" />
      </div>
    );
  }
}
