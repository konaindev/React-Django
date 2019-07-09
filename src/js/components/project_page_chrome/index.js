import React, { Component } from "react";
import PropTypes from "prop-types";

import PageChrome from "../page_chrome";
import UserMenu from "../user_menu";

import "./project_page_chrome.scss";

/**
 * @class ProjectPageChrome
 *
 * @classdesc Render generic header/footer chrome for all Remarkably pages
 * that are related to a specific project.
 */
export default class ProjectPageChrome extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    topItems: PropTypes.node,
    children: PropTypes.node.isRequired
  };

  render() {
    const headerItems = <UserMenu {...this.props.user} />;

    return (
      <PageChrome headerItems={headerItems} topItems={this.props.topItems}>
        {this.props.children}
      </PageChrome>
    );
  }
}
