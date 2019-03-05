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
        <p className="section-header__title">{title}</p>
        {children && <div className="section-header__extra">{this.props.children}</div>}
      </div>
    );
  }
}

export default SectionHeader;
