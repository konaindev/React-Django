import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { formatDeltaPercent } from "../../utils/formatters";
import "./delta_indicator.scss";

export default class DeltaIndicator extends Component {
  static DIRECTION_UP = 1;
  static DIRECTION_FLAT = 0;
  static DIRECTION_DOWN = -1;

  static propTypes = {
    delta: PropTypes.any,
    direction: PropTypes.oneOf([
      DeltaIndicator.DIRECTION_UP,
      DeltaIndicator.DIRECTION_FLAT,
      DeltaIndicator.DIRECTION_DOWN
    ]),
    formatter: PropTypes.func,
    indicatorPos: PropTypes.oneOf(["left", "right"])
  };

  static defaultProps = {
    formatter: formatDeltaPercent,
    indicatorPos: "left"
  };

  render() {
    const { delta, formatter, indicatorPos } = this.props;
    const direction = this.props.direction || Math.sign(delta);
    const deltaArrow = direction > 0 ? "▲" : direction < 0 ? "▼" : "▶";
    const arrowClass = cn("delta-indicator__arrow", {
      "delta-indicator__trend-up": direction > 0,
      "delta-indicator__trend-down": direction < 0,
      "delta-indicator__trend-flat": direction === 0
    });

    return delta == null ? (
      <div className="delta-indicator">
        <span className={arrowClass}>&nbsp;</span>
        <span className="delta-indicator__delta">&nbsp;</span>
      </div>
    ) : indicatorPos === "left" ? (
      <div className="delta-indicator">
        <span className={arrowClass}>{deltaArrow}</span>{" "}
        <span className="delta-indicator__delta">{formatter(delta)}</span>
      </div>
    ) : (
      <div className="delta-indicator">
        <span className="delta-indicator__delta">{formatter(delta)}</span>{" "}
        <span className={arrowClass}>{deltaArrow}</span>
      </div>
    );
  }
}
