import React, { Component } from "react";
import PropTypes from "prop-types";

import Header from "../header";
import ProjectDropDown from "../project_drop_down";
import ReportLinks from "../report_links";

import CommonReport from "../common_report";

// TODO @davepeck @leo -- this is copied code; we should fix this.

/**
 * @description The full landing page for a single project report
 */
export default class PerformanceReportPage extends Component {
  // TODO further define the shape of a report and a project...
  static propTypes = {
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  componentDidMount() {
    console.log("Report data", this.props.report);
  }

  render() {
    // TODO CHROME DAVEPECK
    // const navigationItems = (
    //   <NavigationItems>
    //     <ProjectNavigationItem project={this.props.project} />
    //   </NavigationItems>
    // );
    const navigationItems = <></>;

    return (
      <div className="page report-page">
        <Header navigationItems={navigationItems}>
          <>
            <ReportLinks
              current_report_link={this.props.current_report_link}
              report_links={this.props.report_links.performance}
            />
            <CommonReport report={this.props.report} />
          </>
        </Header>
      </div>
    );
  }
}
