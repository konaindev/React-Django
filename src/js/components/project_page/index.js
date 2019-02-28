import React, { Component } from "react";
import PropTypes from "prop-types";

import Header from "../header";
import { NavigationItems, ProjectNavigationItem } from "../navigation";
import "./project_page.scss";

export default class ProjectPage extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired
  };

  renderPeriodLinks(periods) {
    return periods.map(period => (
      <li key={period.url}>
        <a href={period.url} className="period-link">
          {period.description}
        </a>
      </li>
    ));
  }

  renderSection(section) {
    return (
      <div className="report-section">
        <h2>{section.name}</h2>
        <ul className="period-links">
          {this.renderPeriodLinks(section.periods)}
        </ul>
      </div>
    );
  }

  renderSections(sections) {
    return sections.map((section, i) => (
      <div key={i}>{this.renderSection(section)}</div>
    ));
  }

  render() {
    const navigationItems = (
      <NavigationItems>
        <ProjectNavigationItem project={this.props.project} />
      </NavigationItems>
    );

    return (
      <div className="page project-page">
        <Header navigationItems={navigationItems}>
          <div>{this.renderSections(this.props.report_links)}</div>
        </Header>
      </div>
    );
  }
}
