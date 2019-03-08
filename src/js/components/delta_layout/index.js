import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import DeltaIndicator from "../delta_indicator";
import FormattedValueWithSymbol from "../formatted_value_with_symbol";
import "./delta_layout.scss";

const isNil = value => typeof value === "undefined" || value === null;

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

  static build = (
    value,
    delta,
    formatter,
    formatterForDelta,
    reverseArrow,
    symbolType
  ) => {
    const reverseSign = reverseArrow == true ? -1 : 1;
    const direction =
      delta == null
        ? DeltaLayout.DIRECTION_FLAT
        : reverseSign * Math.sign(delta);

    const valueContent = (
      <FormattedValueWithSymbol
        formatter={formatter}
        value={value}
        symbolType={symbolType}
      />
    );

    return (
      <DeltaLayout
        valueContent={valueContent}
        delta={delta}
        formatter={formatterForDelta}
        direction={direction}
      />
    );
  };

  render() {
    const { delta, direction, valueContent } = this.props;
    return (
      <span className="delta-layout">
        {valueContent}

        {!isNil(delta) && (
          <span className="delta-layout__section">
            <DeltaIndicator
              delta={delta}
              direction={direction}
              indicatorPos="left"
            />
          </span>
        )}
      </span>
    );
  }
}
