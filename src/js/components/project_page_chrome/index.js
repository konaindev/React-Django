import React, { Component } from "react";
import PropTypes from "prop-types";

import ProjectDropDown from "../project_drop_down";
import PageChrome from "../page_chrome";

import "./project_page_chrome.scss";

/**
 * @class ProjectPageChrome
 *
 * @classdesc Render generic header/footer chrome for all Remarkably pages
 * that are related to a specific project.
 */
export default class ProjectPageChrome extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    topItems: PropTypes.node,
    children: PropTypes.node.isRequired
  };

  render() {
    const headerItems = <ProjectDropDown project={this.props.project} />;

    return (
      <PageChrome headerItems={headerItems} topItems={this.props.topItems}>
        {this.props.children}
      </PageChrome>
    );
  }
}
