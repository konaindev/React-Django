import React, { Component } from "react";
import PropTypes from "prop-types";

import Header from "../components/Header";
import {
  NavigationItems,
  ProjectNavigationItem
} from "../components/Navigation";

export default class ProjectPage extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired
  };

  renderPeriodLinks(periods) {
    return periods.map(period => (
      <li key={period.url}>
        <a href={period.url} className="text-remark-ui-text-light">
          {period.description}
        </a>
      </li>
    ));
  }

  renderSection(section) {
    return (
      <div className="p-8">
        <h2>{section.name}</h2>
        <ul className="py-4 leading-normal">
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
      <div className="page">
        <Header navigationItems={navigationItems}>
          <div>{this.renderSections(this.props.report_links)}</div>
        </Header>
      </div>
    );
  }
}
