import React, { Component } from "react";
import PropTypes from "prop-types";

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

  render() {
    return (
      <div className="page-header-outer">
        <header className="page-header-inner">
          {this.renderChildren()}
          <RemarkablyLogo />
        </header>
      </div>
    );
  }
}
