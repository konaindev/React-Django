import React, { Component } from "react";
import PropTypes from "prop-types";

import Container from "../container";
import SectionHeader from "../section_header";
import "./report_section.scss";

/**
 * @class ReportSection
 *
 * @classdesc A named, grouped section of a report.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
export default class ReportSection extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="report-section">
        <SectionHeader title={this.props.name} />
        {this.props.children}
      </div>
    );
  }
}
