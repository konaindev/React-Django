import React, { Component } from "react";
import PropTypes from "prop-types";

import Header from "../header";
import { NavigationItems, ProjectNavigationItem } from "../navigation";
import { ProjectTabs } from "../project_tabs";

import Report from "../report";

/**
 * @description The full landing page for a single project report
 */
export default class ReportPage extends Component {
  // TODO further define the shape of a report and a project...
  static propTypes = {
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  componentDidMount() {
    console.log("Report data", this.props.report);
  }

  render() {
    const navigationItems = (
      <NavigationItems>
        <ProjectNavigationItem project={this.props.project} />
      </NavigationItems>
    );

    return (
      <div className="page">
        <Header navigationItems={navigationItems}>
          <>
            <ProjectTabs
              current_report_link={this.props.current_report_link}
              report_links={this.props.report_links}
            />
            <Report report={this.props.report} />
          </>
        </Header>
      </div>
    );
  }
}
