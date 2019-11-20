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
    user: PropTypes.object,
    topItems: PropTypes.node,
    navLinks: PropTypes.object,
    children: PropTypes.node.isRequired
  };

  getHeaderItems() {
    if (this.props.user) {
      return <UserMenu {...this.props.user} />;
    }
    return null;
  }

  render() {
    const headerItems = this.getHeaderItems();
    return (
      <PageChrome
        headerItems={headerItems}
        topItems={this.props.topItems}
        navLinks={this.props.navLinks}
      >
        {this.props.children}
      </PageChrome>
    );
  }
}
