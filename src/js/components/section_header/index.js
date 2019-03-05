import React, { Component } from "react";
import PropTypes from "prop-types";
import "./section_header.scss";

export class SectionHeader extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node
  };

  render() {
    const { children, title } = this.props;
    return (
      <div className="section-header">
        <h2 className="section-header__title">{title}</h2>
        {children && (
          <div className="section-header__extra">{this.props.children}</div>
        )}
      </div>
    );
  }
}

export default SectionHeader;
