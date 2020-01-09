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
import { getDefaultDirection, getPercentageDirection } from "../../utils/misc";
import cn from "classnames";
import PropertyStatus from "../property_status";
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
    infoTooltip: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    detail2: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    innerBox: PropTypes.element,
    tooltip: PropTypes.node,
    ctaCallback: PropTypes.func,
    ctaText: PropTypes.string
  };

  render() {
    const {
      name,
      content,
      innerBox,
      detail,
      detail2,
      tooltip,
      infoTooltip,
      ctaText,
      ctaCallback,
      performanceRating,
      staticData
    } = this.props;

    const contentValue = (
      <span className="large-box__content-value">{content}</span>
    );
    console.log("------->>>>", detail);
    const wrapperId = !staticData
      ? "large-box__wrapper-static"
      : "large-box__wrapper";
    return (
      <div id={wrapperId}>
        <Panel className="large-box">
          {/* Container for the content itself.
            Counter-intuitively items- and text- center the rows and row content
            while justif- centers the rows vertically within the box. */}

          {ctaCallback && (
            <div className="large-box__cta-container">
              {ctaText || "View Details →"}
            </div>
          )}

          <PropertyStatus
            className="large-box__health-badge"
            performance_rating={performanceRating}
          />
          <div className="large-box__content">
            <div className="large-box__inner-container">
              <span className="large-box__top-line">
                <span className="test">{name}</span>
                <InfoTooltip
                  className="tooltip-wrapper"
                  transKey={infoTooltip}
                />
              </span>
              {tooltip ? (
                <Tooltip placement="top" overlay={tooltip}>
                  {contentValue}
                </Tooltip>
              ) : (
                contentValue
              )}
              <div className="large-box__detail-wrapper">
                <p className="large-box__bottom-line">{detail}</p>
                <p className="large-box__bottom-line">{detail2}</p>
              </div>
            </div>
            <div className="large-box__extra-container">
              {innerBox && (
                <div className="large-box__content-extra">{innerBox}</div>
              )}
            </div>
          </div>
        </Panel>
      </div>
    );
  }
}

// Define LargeBoxLayouts that take values and targets of various types.

// use this in case NOT to color "x" with blue
// otherwise use LargeNumberBox with "symbolType" prop
export const LargeMultipleBox = withFormatters(
  LargeBoxLayout,
  formatMultiple,
  formatMultiple,
  getDefaultDirection
);
export const LargePercentBox = withFormatters(
  LargeBoxLayout,
  formatPercent,
  formatDeltaPercent,
  getPercentageDirection
);
export const LargeDetailPercentBox = withFormatters(
  LargeBoxLayout,
  value => formatPercent(value, 1),
  formatDeltaPercent,
  getPercentageDirection
);
export const LargeNumberBox = withFormatters(
  LargeBoxLayout,
  formatNumber,
  formatNumber,
  getDefaultDirection
);
export const LargeCurrencyBox = withFormatters(
  LargeBoxLayout,
  formatCurrency,
  formatCurrency,
  getDefaultDirection
);
export const LargeCurrencyShorthandBox = withFormatters(
  LargeBoxLayout,
  formatCurrencyShorthandWithDigit,
  formatCurrencyShorthandWithDigit,
  getDefaultDirection
);
export const LargeDateBox = withFormatters(LargeBoxLayout, formatDate);
