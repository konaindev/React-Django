import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * @class ReportSection
 *
 * @classdesc A named, grouped section of a report.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
class ReportSection extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    horizontalPadding: PropTypes.bool.isRequired
  };

  static defaultProps = {
    horizontalPadding: true
  };

  render() {
    const className = this.props.horizontalPadding ? "p-8" : "py-8";

    return (
      <div className={className}>
        <span className="mx-4 text-remark-ui-text uppercase block tracking-wide">
          {this.props.name}
        </span>
        <hr className="k-divider mt-8 mb-12 mx-0" />
        {this.props.children}
      </div>
    );
  }
}
