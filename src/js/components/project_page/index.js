import React, { Component } from "react";
import PropTypes from "prop-types";

import ProjectPageChrome from "../project_page_chrome";

import "./project_page.scss";

export default class ProjectPage extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired
  };

  renderLink(link) {
    return (
      <li key={link.url}>
        <a href={link.url} className="project-page__report-section__link">
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
      <div className="project-page__report-section">
        <h2>{name}</h2>
        <ul className="project-page__report-section__links">
          {this.renderLinks(links)}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <ProjectPageChrome project={this.props.project}>
        <div>
          {this.renderSection(
            this.props.report_links.baseline,
            "Baseline Report"
          )}
        </div>
        <div>
          {this.renderSection(
            this.props.report_links.performance,
            "Performance Reports"
          )}
        </div>
        <div>
          {this.renderSection(
            this.props.report_links.modeling,
            "Modeling Report"
          )}
        </div>
        <div>
          {this.renderSection(this.props.report_links.market, "Market Report")}
        </div>
      </ProjectPageChrome>
    );
  }
}
