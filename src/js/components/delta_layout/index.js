import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import DeltaIndicator from "../delta_indicator";
import "./delta_layout.scss";

/**
 * @class DeltaLayout
 *
 * @classdesc Lays out a value and its delta, including primary, arrow, and colors.
 *
 * @note This provides layout only; it is not concerned with semantics.
 */
export default class DeltaLayout extends Component {
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
    const direction =
      delta == null
        ? DeltaLayout.DIRECTION_FLAT
        : reverseSign * Math.sign(delta);
    return (
      <DeltaLayout
        value={formatter(value)}
        delta={delta}
        formatter={formatterForDelta}
        direction={direction}
      />
    );
  };

  render() {
    return (
      <span className="delta-layout">
        <span>{this.props.value}</span>
        <span className="delta-layout__section">
          <DeltaIndicator
            delta={this.props.delta}
            direction={this.props.direction}
            indicatorPos="left"
          />
        </span>
      </span>
    );
  }
}
