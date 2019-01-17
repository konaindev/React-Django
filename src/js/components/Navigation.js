import React, { Component } from "react";
import PropTypes from "prop-types";

import { formatDate } from "../utils/formatters";

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
        <span
          className="bg-grey rounded inline-block"
          style={{
            minWidth: "2rem",
            minHeight: "2rem",
            width: "2rem",
            height: "2rem"
          }}
        >
          &nbsp;
        </span>
        <span className="cursor-pointer inline-block px-4 mt-1 align-middle">
          {this.props.project.name} ∨
        </span>
      </>
    );
  }
}

/**
 * @description A navigation item that allows for selection of specific report periods
 */
export class ReportNavigationItem extends Component {
  static propTypes = {
    report: PropTypes.object.isRequired
  };

  render() {
    return (
      <>
        <span className="inline-block align-middle mt-1 text-sm text-remark-ui-text mr-8">
          {formatDate(this.props.report.start, false)} -{" "}
          {formatDate(this.props.report.end, false)}
        </span>
        <span
          className="cursor-pointer inline-block align-middle -mx-4 -mt-1 -mb-2 px-4 py-2 rounded"
          style={{ backgroundColor: "#232837" }}
        >
          Last Week ∨
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
    // wrap each child in suitable padding/border; the lastmost child
    // has no border and different padding.
    const childCount = React.Children.count(this.props.children);
    let childrenLeft = childCount;
    const wrappedChildren = React.Children.map(this.props.children, child => {
      childrenLeft -= 1;
      const classNames = childrenLeft
        ? "block h-16 pt-4 px-4 border-r border-solid border-remark-ui-border"
        : "block h-16 pt-4 pl-4";
      return <li className={classNames}>{child}</li>;
    });

    // render navigation items
    return (
      <ul
        className="block h-16 text-sans -mt-4 p-0"
        style={{ columns: childCount }}
      >
        {wrappedChildren}
      </ul>
    );
  }
}
