import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

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
    horizontalPadding: PropTypes.bool.isRequired
  };

  static defaultProps = {
    // TODO this prop looks like a hack
    horizontalPadding: true
  };

  render() {
    return (
      <Container
        className={cn("report-section", {
          "horizontal-padding": this.props.horizontalPadding
        })}
      >
        <SectionHeader title={this.props.name} />
        {this.props.children}
      </Container>
    );
  }
}
