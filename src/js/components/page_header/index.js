import React, { Component } from "react";
import PropTypes from "prop-types";

import Container from "../container";
import TopNavigation from "../top_navigation";
import RemarkablyLogo from "../remarkably_logo";

import "./page_header.scss";

/**
 * @class PageHeader
 *
 * @classdesc Render site-wide branded header, with pluggable nav items
 */
export default class PageHeader extends Component {
  renderChildren() {
    const childCount = React.Children.count(this.props.children);

    // render nothing if we have no children
    if (childCount == 0) {
      return null;
    }

    // Nest children in nav wrappers
    const wrappedChildren = React.Children.map(this.props.children, child => (
      <li className="page-header__item">{child}</li>
    ));

    // wrap children if we have them
    return (
      <nav className="page-header__items-outer">
        <ul
          className="page-header__items-inner"
          style={{ columns: childCount }}
        >
          {wrappedChildren}
        </ul>
      </nav>
    );
  }

  renderNavLink() {
    if (!this.props.navLinks) {
      return null;
    }
    return (
      <div className="page-header__nav">
        <TopNavigation {...this.props.navLinks} />
      </div>
    );
  }

  render() {
    return (
      <div className="page-header">
        <Container className="page-header__inner">
          <RemarkablyLogo />
          {this.renderNavLink()}
          {this.renderChildren()}
        </Container>
      </div>
    );
  }
}
