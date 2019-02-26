import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * @class DeltaLayout
 *
 * @classdesc Lays out a value and its delta, including primary, arrow, and colors.
 *
 * @note This provides layout only; it is not concerned with semantics.
 */
class DeltaLayout extends Component {
  static DIRECTION_UP = 1;
  static DIRECTION_FLAT = 0;
  static DIRECTION_DOWN = -1;

  static propTypes = {
    value: PropTypes.any.isRequired,
    delta: PropTypes.any,
    direction: PropTypes.oneOf([
      DeltaLayout.DIRECTION_UP,
      DeltaLayout.DIRECTION_FLAT,
      DeltaLayout.DIRECTION_DOWN
    ]).isRequired
  };

  static build = (value, delta, formatter, formatterForDelta, reverseArrow) => {
    const reverseSign = reverseArrow == true ? -1 : 1;
    return (
      <DeltaLayout
        value={formatter(value)}
        delta={delta == null ? null : formatterForDelta(delta)}
        direction={reverseSign * Math.sign(delta)}
      />
    );
  };

  render() {
    const deltaArrow =
      this.props.direction > 0 ? "▲" : this.props.direction < 0 ? "▼" : "▶";
    const deltaColor =
      this.props.direction > 0
        ? "text-remark-trend-up"
        : this.props.direction < 0
        ? "text-remark-trend-down"
        : "text-remark-trend-flat";

    const deltaSection =
      this.props.delta == null ? (
        <>
          <span className={`${deltaColor} pl-2 pr-1`}>&nbsp;</span>
          <span className="text-remark-ui-text">&nbsp;</span>
        </>
      ) : (
        <>
          <span className={`${deltaColor} pl-2 pr-1`}>{deltaArrow}</span>
          <span className="text-remark-ui-text">{this.props.delta}</span>
        </>
      );

    return (
      <span className="flex flex-col leading-tight">
        <span>{this.props.value}</span>
        <span className="text-base">{deltaSection}</span>
      </span>
    );
  }
}
