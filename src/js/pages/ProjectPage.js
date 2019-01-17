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

  render() {
    const navigationItems = (
      <NavigationItems>
        <ProjectNavigationItem project={this.props.project} />
      </NavigationItems>
    );

    // TODO for now, simply render links to each time frame
    const items = this.props.report_links.map(report_link => {
      const [start, end, url] = report_link;
      return (
        <li key={url}>
          <a href={url} className="text-remark-ui-text-light">
            {start} - {end}
          </a>
        </li>
      );
    });

    return (
      <div className="page">
        <Header navigationItems={navigationItems}>
          <div className="p-8">
            <h2>All available periods:</h2>
            <ul className="py-4 leading-normal">{items}</ul>
          </div>
        </Header>
      </div>
    );
  }
}
