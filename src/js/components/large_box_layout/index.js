import React, { Component } from "react";
import PropTypes from "prop-types";

import withFormatters from '../with_formatters';
import {
  formatMultiple,
  formatPercent,
  formatDeltaPercent,
  formatNumber,
  formatCurrency,
  formatCurrencyShorthand,
  formatDate
} from '../../utils/formatters';

/**
 * @class LargeBoxLayout
 *
 * @classdesc A simple layout intended to emphasize a single metric. Uses large
 * text sizing, bright colors, and lots of white space.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
class LargeBoxLayout extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    detail2: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    innerBox: PropTypes.element
  };

  renderInnerBox() {
    return this.props.innerBox ? (
      <div className="w-48 h-48 bg-transparent overflow-hidden">
        {this.props.innerBox}
      </div>
    ) : (
      <></>
    );
  }

  render() {
    return (
      <div className="flex flex-col p-6 h-64 k-rectangle items-center text-center justify-center">
        {/* Container for the content itself.
            Counter-intuitively items- and text- center the rows and row content
            while justif- centers the rows vertically within the box. */}
        <span className="text-remark-ui-text-light text-base">
          {this.props.name}
        </span>
        <div className="flex items-center text-center justify-center">
          <span className="text-remark-ui-text-lightest font-mono text-6xl font-hairline py-2 w-full">
            {this.props.content}
          </span>
          {this.renderInnerBox()}
        </div>
        <span className="text-remark-ui-text text-sm">{this.props.detail}</span>
        <span className="text-remark-ui-text text-sm">
          {this.props.detail2}
        </span>
      </div>
    );
  }
}

// Define LargeBoxLayouts that take values and targets of various types.
const LargeMultipleBox = withFormatters(LargeBoxLayout, formatMultiple);
const LargePercentBox = withFormatters(
  LargeBoxLayout,
  formatPercent,
  formatDeltaPercent
);
const LargeDetailPercentBox = withFormatters(
  LargeBoxLayout,
  value => formatPercent(value, 1),
  formatDeltaPercent
);
const LargeNumberBox = withFormatters(LargeBoxLayout, formatNumber);
const LargeCurrencyBox = withFormatters(LargeBoxLayout, formatCurrency);
const LargeCurrencyShorthandBox = withFormatters(
  LargeBoxLayout,
  formatCurrencyShorthand
);
const LargeDateBox = withFormatters(LargeBoxLayout, formatDate);

export {
  LargeBoxLayout,
  LargeMultipleBox,
  LargePercentBox,
  LargeDetailPercentBox,
  LargeNumberBox,
  LargeCurrencyBox,
  LargeCurrencyShorthandBox,
  LargeDateBox
};
