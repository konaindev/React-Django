import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./section_header.scss";

export class SectionHeader extends Component {
  static propTypes = {
    title: PropTypes.node.isRequired,
    children: PropTypes.node,
    smallMarginTop: PropTypes.bool
  };

  render() {
    const { children, title, smallMarginTop } = this.props;

    return (
      <div
        className={cn("section-header", {
          "section-header--mt-sm": smallMarginTop
        })}
      >
        <p className="section-header__title">{title}</p>
        {children && (
          <div className="section-header__extra">{this.props.children}</div>
        )}
      </div>
    );
  }
}

export default SectionHeader;
