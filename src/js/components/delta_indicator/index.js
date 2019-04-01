import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { formatDeltaPercent } from "../../utils/formatters";
import "./delta_indicator.scss";
import ArrowDown from "../../icons/arrow_down";
import ArrowSide from "../../icons/arrow_side";
import ArrowUp from "../../icons/arrow_up";
import { getDefaultDirection, getPercentageDirection } from "../../utils/misc";

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
    const deltaDirection =
      formatter === formatDeltaPercent
        ? getPercentageDirection(delta)
        : getDefaultDirection(delta);
    const direction = this.props.direction || deltaDirection;
    const deltaArrow =
      direction > 0 ? (
        <ArrowUp width={10} height={5} />
      ) : direction < 0 ? (
        <ArrowDown width={10} height={5} />
      ) : (
        <ArrowSide width={5} height={10} />
      );
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
