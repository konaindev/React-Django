import React, { Component } from "react";
import PropTypes from "prop-types";

import FormattedMultiple from "../formatted_multiple";
import Panel from "../panel";
import Tooltip, { InfoTooltip } from "../rmb_tooltip";
import withFormatters from "../with_formatters";
import {
  formatMultiple,
  formatPercent,
  formatDeltaPercent,
  formatNumber,
  formatCurrency,
  formatCurrencyShorthandWithDigit,
  formatDate
} from "../../utils/formatters";
import ProperyStatus from "../property_status";
import { getDefaultDirection, getPercentageDirection } from "../../utils/misc";

import "./small_box_layout.scss";
import cn from "classnames";

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
    infoTooltip: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    detail2: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    ctaCallback: PropTypes.func,
    performanceRating: PropTypes.number
  };

  render() {
    const {
      content,
      detail,
      detail2,
      name,
      tooltip,
      infoTooltip,
      ctaCallback,
      performanceRating
    } = this.props;
    const contentValue = (
      <span className="small-box__inner-content">{content}</span>
    );

    return (
      <Panel
        className="small-box"
        onClick={x => (ctaCallback ? ctaCallback(x) : false)}
      >
        <div className="small-box__wrapper">
          {performanceRating && (
            <ProperyStatus
              className="small-box__badge"
              performance_rating={performanceRating}
            />
          )}
          {ctaCallback && (
            <div className="small-box__cta">View Details &rarr;</div>
          )}
          <div className="small-box__row">
            <div className="small-box__labels">
              <span className="small-box__labels__name">{name}</span>
              {detail2 && (
                <span className="small-box__labels__detail">{detail2}</span>
              )}
              {detail && (
                <span className="small-box__labels__detail">{detail}</span>
              )}
            </div>
            <div className="small-box__outer-content">
              {tooltip ? (
                <Tooltip placement="top" overlay={tooltip}>
                  {contentValue}
                </Tooltip>
              ) : (
                contentValue
              )}
            </div>
          </div>
          <InfoTooltip transKey={infoTooltip} />
        </div>
      </Panel>
    );
  }
}

// Define SmallBoxLayouts that take values and targets of various types.

// use this in case NOT to color "x" with blue
// otherwise use LargeNumberBox with "symbolType" prop
const SmallMultipleBox = withFormatters(
  SmallBoxLayout,
  formatMultiple,
  formatMultiple,
  getDefaultDirection
);

const SmallPercentBox = withFormatters(
  SmallBoxLayout,
  formatPercent,
  formatDeltaPercent,
  getPercentageDirection
);
const SmallNumberBox = withFormatters(
  SmallBoxLayout,
  formatNumber,
  formatNumber,
  getDefaultDirection
);
const SmallCurrencyBox = withFormatters(
  SmallBoxLayout,
  formatCurrency,
  formatCurrency,
  getDefaultDirection
);
const SmallCurrencyShorthandBox = withFormatters(
  SmallBoxLayout,
  formatCurrencyShorthandWithDigit,
  formatCurrencyShorthandWithDigit,
  getDefaultDirection
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
