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
    name: PropTypes.string.isRequired,
    // sectionItems are arbitrary extra items to render in the section header
    sectionItems: PropTypes.node,
    smallMarginTop: PropTypes.bool
  };

  render() {
    const { reportInfo, smallMarginTop } = this.props;
    return (
      <div className="report-section">
        <SectionHeader title={this.props.name} smallMarginTop={smallMarginTop}>
          {this.props.sectionItems}
        </SectionHeader>
        {this.props.children}
      </div>
    );
  }
}
