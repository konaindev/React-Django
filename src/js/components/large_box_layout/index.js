import React, { Component } from "react";
import PropTypes from "prop-types";

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
    name: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    detail2: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    innerBox: PropTypes.element
  };

  renderInnerBox() {
    return this.props.innerBox ? (
      <div className="large-box__inner-box">{this.props.innerBox}</div>
    ) : (
      <></>
    );
  }

  render() {
    return (
      <div className="large-box panel-rounded-rect">
        {/* Container for the content itself.
            Counter-intuitively items- and text- center the rows and row content
            while justif- centers the rows vertically within the box. */}
        <span className="large-box__name">{this.props.name}</span>
        <div className="large-box__outer-content">
          <span className="large-box__inner-content">{this.props.content}</span>
          {this.renderInnerBox()}
        </div>
        <span className="large-box__detail">{this.props.detail}</span>
        <span className="large-box__detail">{this.props.detail2}</span>
      </div>
    );
  }
}

// Define LargeBoxLayouts that take values and targets of various types.

// @TODO: replace references of LargeMultipleBox with LargeNumberBox
// just pass symbolType="multiple"
export const LargeMultipleBox = withFormatters(LargeBoxLayout, formatNumber);
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
