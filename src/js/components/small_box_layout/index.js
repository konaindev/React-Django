import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * @class SmallBoxLayout
 *
 * @classdesc A simple layout intended to display a secondary metric. Uses
 * smaller text sizing, dimmer colors, and a little less white space.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
class SmallBoxLayout extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  render() {
    return (
      <div className="flex flex-row h-full my-4 py-6 k-rectangle">
        {/* Container for the label and detail text */}
        <div className="flex flex-col flex-auto justify-between">
          <span className="text-remark-ui-text-light text-base pl-8">
            {this.props.name}
          </span>
          <span className="text-remark-ui-text text-sm pl-8 mt-2">
            {this.props.detail}
          </span>
        </div>
        {/* Container for the content itself */}
        <div className="text-5xl flex flex-col leading-compressed justify-center content-center">
          <div className="text-remark-ui-text-lightest font-hairline font-mono text-right pr-8">
            {this.props.content}
          </div>
        </div>
      </div>
    );
  }
}

// Define SmallBoxLayouts that take values and targets of various types.
const SmallMultipleBox = withFormatters(SmallBoxLayout, formatMultiple);
const SmallPercentBox = withFormatters(
  SmallBoxLayout,
  formatPercent,
  formatDeltaPercent
);
const SmallNumberBox = withFormatters(SmallBoxLayout, formatNumber);
const SmallCurrencyBox = withFormatters(SmallBoxLayout, formatCurrency);
const SmallCurrencyShorthandBox = withFormatters(
  SmallBoxLayout,
  formatCurrencyShorthand
);
const SmallDateBox = withFormatters(SmallBoxLayout, formatDate);
