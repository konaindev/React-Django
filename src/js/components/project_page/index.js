import React, { Component } from "react";
import PropTypes from "prop-types";

import ProjectPageChrome from "../project_page_chrome";
import Container from "../container";
import { connect } from "react-redux";

import "./project_page.scss";

export class ProjectPage extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired
  };

  static groupTitlesByReport = {
    baseline: "Baseline Report",
    market: "Market Report",
    modeling: "Modeling Report",
    campaign_plan: "Campaign Plan",
    performance: "Performance Reports"
  };

  renderLink(link) {
    return (
      <li key={link.url}>
        <a href={link.url} className="project-page__report-link">
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

  renderGroups(reportLinks) {
    const titles = ProjectPage.groupTitlesByReport;

    return (
      <React.Fragment>
        {Object.keys(titles).map(report_name => (
          <div key={report_name} className="project-page__report-group">
            <h2>{titles[report_name]}</h2>
            <ul>{this.renderLinks(reportLinks[report_name])}</ul>
          </div>
        ))}
      </React.Fragment>
    );
  }

  render() {
    return (
      <ProjectPageChrome project={this.props.project}>
        <Container className="project-page__container">
          {this.renderGroups(this.props.report_links)}
        </Container>
      </ProjectPageChrome>
    );
  }
}

export default connect(x => x)(ProjectPage);
