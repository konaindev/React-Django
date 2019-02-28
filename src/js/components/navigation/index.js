import React, { Component } from "react";
import PropTypes from "prop-types";
import "./navigation.scss";

/**
 * @description A navigation item that allows for selection of different projects
 */
export class ProjectNavigationItem extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired
  };

  render() {
    return (
      <>
        <span className="project-navigation-item_image">&nbsp;</span>
        <span className="project-navigation-item_text">
          {this.props.project.name} ∨
        </span>
      </>
    );
  }
}

/**
 * @description A wrapper for multiple navigation items
 */
export class NavigationItems extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]).isRequired
  };

  render() {
    const childCount = React.Children.count(this.props.children);
    const wrappedChildren = React.Children.map(this.props.children, child => {
      return <li className="navigation-item">{child}</li>;
    });

    // render navigation items
    return (
      <ul className="navigation-items" style={{ columns: childCount }}>
        {wrappedChildren}
      </ul>
    );
  }
}
