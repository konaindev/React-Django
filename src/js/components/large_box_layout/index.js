import React, { Component } from "react";
import PropTypes from "prop-types";

import FormattedMultiple from "../formatted_multiple";
import Panel from "../panel";
import withFormatters from "../with_formatters";
import {
  formatMultiple,
  formatPercent,
  formatDeltaPercent,
  formatNumber,
  formatCurrency,
  formatCurrencyShorthand,
  formatDate
} from "../../utils/formatters";

import "./large_box_layout.scss";

/**
 * @class LargeBoxLayout
 *
 * @classdesc A simple layout intended to emphasize a single metric. Uses large
 * text sizing, bright colors, and lots of white space.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
export class LargeBoxLayout extends Component {
  static propTypes = {
    name: PropTypes.node.isRequired,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    detail2: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    innerBox: PropTypes.element
  };

  render() {
    const { name, content, innerBox, detail, detail2 } = this.props;

    return (
      <Panel className="large-box">
        {/* Container for the content itself.
            Counter-intuitively items- and text- center the rows and row content
            while justif- centers the rows vertically within the box. */}
        <span className="large-box__top-line">{name}</span>
        <div className="large-box__content">
          <span className="large-box__content-value">{content}</span>
          {innerBox && (
            <div className="large-box__content-extra">{innerBox}</div>
          )}
        </div>
        <span className="large-box__bottom-line">{detail}</span>
        <span className="large-box__bottom-line">{detail2}</span>
      </Panel>
    );
  }
}

// Define LargeBoxLayouts that take values and targets of various types.

// use this in case NOT to color "x" with blue
// otherwise use LargeNumberBox with "symbolType" prop
export const LargeMultipleBox = withFormatters(LargeBoxLayout, formatMultiple);

export const LargePercentBox = withFormatters(
  LargeBoxLayout,
  formatPercent,
  formatDeltaPercent
);
export const LargeDetailPercentBox = withFormatters(
  LargeBoxLayout,
  value => formatPercent(value, 1),
  formatDeltaPercent
);
export const LargeNumberBox = withFormatters(LargeBoxLayout, formatNumber);
export const LargeCurrencyBox = withFormatters(LargeBoxLayout, formatCurrency);
export const LargeCurrencyShorthandBox = withFormatters(
  LargeBoxLayout,
  formatCurrencyShorthand
);
export const LargeDateBox = withFormatters(LargeBoxLayout, formatDate);
