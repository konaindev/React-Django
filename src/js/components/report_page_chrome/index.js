import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportLinks from "../report_links";
import ProjectPageChrome from "../project_page_chrome";

import "./report_page_chrome.scss";

/**
 * @class ReportPageChrome
 *
 * @classdesc Render generic header/footer chrome for all Remarkably pages
 * that are related to a report for a specific project.
 */
export default class ReportPageChrome extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    current_report_name: PropTypes.string.isRequired,
    report_links: PropTypes.object.isRequired,
    topItems: PropTypes.node,
    children: PropTypes.node.isRequired
  };

  render() {
    const topItems = (
      <>
        <ReportLinks
          current_report_name={this.props.current_report_name}
          report_links={this.props.report_links}
        />
        {this.props.topItems}
      </>
    );

    return (
      <ProjectPageChrome project={this.props.project} topItems={topItems}>
        {this.props.children}
      </ProjectPageChrome>
    );
  }
}
