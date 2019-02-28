import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

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
      <div
        className={cn("report-section", {
          "horizontal-padding": this.props.horizontalPadding
        })}
      >
        <span className="report-section__name">{this.props.name}</span>
        <hr className="horizontal-divider report-section__divider" />
        {this.props.children}
      </div>
    );
  }
}
