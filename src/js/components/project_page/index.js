// @TOOD: rendering error for now...
// https://staging.remarkably.io/projects/pro_fc583mab3bfo4zs5/
// Originally it was supposed to display list of report links

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import PageChrome from "../page_chrome";
import Container from "../container";
import { connect } from "react-redux";

import "./project_page.scss";

export class ProjectPage extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
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
        <Link to={link.url} className="project-page__report-link">
          {link.description}
        </Link>
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
  componentDidMount() {
    const { name, public_id } = this.props;
    // send a page render event to segment when this mounts
    window.analytics.page("/project", {}, { name, public_id });
  }
  render() {
    return (
      <PageChrome project={this.props.project} user={this.props.user}>
        <Container className="project-page__container">
          {this.renderGroups(this.props.report_links)}
        </Container>
      </PageChrome>
    );
  }
}

const mapState = state => {
  return {
    ...state.dashboard,
    ...state.network
  };
};
export default connect(mapState)(ProjectPage);
