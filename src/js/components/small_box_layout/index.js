import React, { Component } from "react";
import PropTypes from "prop-types";

import FormattedMultiple from "../formatted_multiple";
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

import "./small_box_layout.scss";

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
    const { content, detail, name } = this.props;
    return (
      <div className="small-box panel-rounded-rect">
        {/* Container for the label and detail text */}
        <div className="small-box__labels">
          <span className="small-box__labels__name">{name}</span>
          {detail && (
            <span className="small-box__labels__detail">{detail}</span>
          )}
        </div>
        {/* Container for the content itself */}
        <div className="small-box__outer-content">
          <div className="small-box__inner-content">{content}</div>
        </div>
      </div>
    );
  }
}

// Define SmallBoxLayouts that take values and targets of various types.

// use this in case NOT to color "x" with blue
// otherwise use LargeNumberBox with "symbolType" prop
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

export {
  SmallBoxLayout,
  SmallMultipleBox,
  SmallPercentBox,
  SmallNumberBox,
  SmallCurrencyBox,
  SmallCurrencyShorthandBox,
  SmallDateBox
};
