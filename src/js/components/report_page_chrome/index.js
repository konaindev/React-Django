import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import ReportLinks from "../report_links";
import ProjectPageChrome from "../project_page_chrome";
import ShareToggle from "../share_toggle";

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
    user: PropTypes.object.isRequired,
    current_report_name: PropTypes.string.isRequired,
    report_links: PropTypes.object.isRequired,
    share_info: PropTypes.object,
    topItems: PropTypes.node,
    children: PropTypes.node.isRequired
  };

  render() {
    const {
      project,
      user,
      current_report_name,
      report_links,
      share_info
    } = this.props;

    const topItems = (
      <section className="report-page-subheader">
        <div className="container">
          <div className="subheader__inner">
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

    return (
      <ProjectPageChrome user={user} topItems={topItems}>
        {this.props.children}
      </ProjectPageChrome>
    );
  }
}
