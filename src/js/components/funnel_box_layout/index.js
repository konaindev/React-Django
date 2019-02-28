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
      <div className="flex flex-row h-24 my-2 py-6 panel-rounded-rect">
        {/* Container for the label and detail text */}
        <div className="flex flex-col flex-auto justify-between">
          <span className="text-remark-ui-text-light text-base pl-8">
            {this.props.name}
          </span>
          <span className="text-remark-ui-text text-sm pl-8">
            {this.props.detail}
          </span>
        </div>
        {/* Container for the content itself */}
        <div className="text-4xl flex flex-col leading-compressed justify-center content-center">
          <div className="text-remark-ui-text-lightest font-hairline font-mono text-right pr-8">
            {this.props.content}
          </div>
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
