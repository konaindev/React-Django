import React, { Component } from "react";
import PropTypes from "prop-types";

import ProjectDropDown from "../project_drop_down";
import "./project_page.scss";

export default class ProjectPage extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired
  };

  renderLink(link) {
    return (
      <li key={link.url}>
        <a href={link.url} className="report-link">
          {link.description}
        </a>
      </li>
    );
  }

  renderLinks(links) {
    return links == null ? (
      <li>(no reports)</li>
    ) : links.length == null ? (
      this.renderLink(links)
    ) : (
      links.map(link => this.renderLink(link))
    );
  }

  renderSection(links, name) {
    return (
      <div className="report-section">
        <h2>{name}</h2>
        <ul className="report-links">{this.renderLinks(links)}</ul>
      </div>
    );
  }

  render() {
    // TODO CHROME DAVEPECK
    // const navigationItems = (
    //   <NavigationItems>
    //     <ProjectNavigationItem project={this.props.project} />
    //   </NavigationItems>
    // );
    const navigationItems = <></>;

    // return (
    //   <div className="page project-page">
    //     <Header navigationItems={navigationItems}>
    //       <div>
    //         {this.renderSection(
    //           this.props.report_links.baseline,
    //           "Baseline Report"
    //         )}
    //       </div>
    //       <div>
    //         {this.renderSection(
    //           this.props.report_links.performance,
    //           "Performance Reports"
    //         )}
    //       </div>
    //       <div>
    //         {this.renderSection(
    //           this.props.report_links.modeling,
    //           "Modeling Report"
    //         )}
    //       </div>
    //       <div>
    //         {this.renderSection(
    //           this.props.report_links.market,
    //           "Market Report"
    //         )}
    //       </div>
    //     </Header>
    //   </div>
    // );
  }
}
