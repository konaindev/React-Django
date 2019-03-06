import React, { Component } from "react";
import PropTypes from "prop-types";

import Header from "../header";
import { NavigationItems, ProjectNavigationItem } from "../navigation";
import ProjectTabs from "../project_tabs";

import CommonReport from "../common_report";

// TODO @davepeck @leo -- this is copied code; we should fix this.

/**
 * @description The full landing page for a single project report
 */
export default class BaselineReportPage extends Component {
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
      <div className="page report-page">
        <Header navigationItems={navigationItems}>
          <>
            <ProjectTabs
              current_report_link={this.props.current_report_link}
              report_links={this.props.report_links}
            />
            <CommonReport report={this.props.report} />
          </>
        </Header>
      </div>
    );
  }
}
