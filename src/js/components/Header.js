import React, { Component } from "react";
import PropTypes from "prop-types";

// TODO figure out how this relates to navigation.
export default class Header extends Component {
  static propTypes = {
    navigationItems: PropTypes.element,
    children: PropTypes.element.isRequired
  };

  render() {
    const navSection = this.props.navigationItems ? (
      <nav className="float-right pr-4 h-16">{this.props.navigationItems}</nav>
    ) : null;

    return (
      <div>
        <header className="text-headline bg-remark-ui-darkest h-16 p-4 leading-tight">
          {navSection}
          <h2>Remarkably</h2>
        </header>
        <div>{this.props.children}</div>
      </div>
    );
  }
}
