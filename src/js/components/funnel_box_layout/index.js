import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  formatMultiple,
  formatPercent,
  formatNumber,
  formatCurrency,
  formatCurrencyShorthand,
  formatDate,
  formatDeltaPercent
} from "../../utils/formatters";

import withFormatters from "../with_formatters";

import "./funnel_box_layout.scss";

/**
 * @class FunnelBoxLayout
 *
 * @classdesc A simple layout intended to metrics in a funnel grid/table.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
export class FunnelBoxLayout extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  render() {
    return (
      <div className="funnel-box panel-rounded-rect">
        {/* Container for the label and detail text */}
        <div className="funnel-box__labels">
          <span className="funnel-box__labels__name">{this.props.name}</span>
          <span className="funnel-box__labels__detail">
            {this.props.detail}
          </span>
        </div>
        {/* Container for the content itself */}
        <div className="funnel-box__outer-content">
          <div className="funnel-box__inner-content">{this.props.content}</div>
        </div>
      </div>
    );
  }
}

// Define FunnelBoxLayouts that take values and targets of various types.
export const FunnelMultipleBox = withFormatters(
  FunnelBoxLayout,
  formatMultiple
);
export const FunnelPercentBox = withFormatters(
  FunnelBoxLayout,
  formatPercent,
  formatDeltaPercent
);
export const FunnelNumberBox = withFormatters(FunnelBoxLayout, formatNumber);
export const FunnelCurrencyBox = withFormatters(
  FunnelBoxLayout,
  formatCurrency
);
export const FunnelCurrencyShorthandBox = withFormatters(
  FunnelBoxLayout,
  formatCurrencyShorthand
);
export const FunnelDateBox = withFormatters(FunnelBoxLayout, formatDate);
