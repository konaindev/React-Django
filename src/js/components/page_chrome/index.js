import React, { Component } from "react";
import PropTypes from "prop-types";

import PageHeader from "../page_header";
import PageFooter from "../page_footer";

import "./page_chrome.scss";

/**
 * @class TopChrome
 *
 * @classdesc Container for all fixed-position chrome (header, tabs, etc)
 */
class TopChrome extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return <div className="top-chrome">{this.props.children}</div>;
  }
}

/**
 * @class BottomChrome
 *
 * @classdesc Container for all bottom page chrome (footer, etc)
 */
class BottomChrome extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return <>{this.props.children}</>;
  }
}

/**
 * @class PageChrome
 *
 * @classdesc Render generic header/footer chrome for all Remarkably pages.
 */
export default class PageChrome extends Component {
  static propTypes = {
    headerItems: PropTypes.node,
    topItems: PropTypes.node,
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="chrome">
        <TopChrome>
          <PageHeader>{this.props.headerItems}</PageHeader>
          {this.props.topItems}
        </TopChrome>
        {this.props.children}
        <BottomChrome>
          <PageFooter />
        </BottomChrome>
      </div>
    );
  }
}
