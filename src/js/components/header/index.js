import React, { Component } from "react";
import PropTypes from "prop-types";
import "./header.scss";

// TODO figure out how this relates to navigation.
export default class Header extends Component {
  static propTypes = {
    navigationItems: PropTypes.element,
    children: PropTypes.element.isRequired
  };

  render() {
    const navSection = this.props.navigationItems ? (
      <nav className="nav-items">{this.props.navigationItems}</nav>
    ) : null;

    return (
      <div className="remarkably-header-container">
        <header className="remarkably-header">
          {navSection}
          <h2>Remarkably</h2>
        </header>
        <div>{this.props.children}</div>
      </div>
    );
  }
}
