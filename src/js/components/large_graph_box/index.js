import React, { Component } from "react";
import PropTypes from "prop-types";

import DeltaIndicator from "../delta_indicator";
import Panel from "../panel";
import WhiskerPlot from "../whisker_plot";
import { getDefaultDirection, getPercentageDirection } from "../../utils/misc";
import { LargeBoxLayout } from "../large_box_layout";
import {
  formatCurrencyShorthandWithDigit,
  formatDeltaPercent,
  targetFormatter,
  formatPercent
} from "../../utils/formatters";

export class LargeGraphBox extends Component {
  static propTypes = {
    delta: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    extraContent: PropTypes.node,
    name: PropTypes.string.isRequired,
    series: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ),
    target: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    digits: PropTypes.number,
    formatValue: PropTypes.func.isRequired,
    formatDelta: PropTypes.func.isRequired,
    formatTarget: PropTypes.func.isRequired
  };

  render() {
    const {
      name,
      value,
      delta,
      target,
      series,
      extraContent,
      formatDelta,
      formatValue,
      formatTarget,
      getDeltaDirection
    } = this.props;

    const graphDeltaBox = (
      <>
        {series != null && (
          <div className="large-box__content-graph">
            {WhiskerPlot.maybe(series, delta >= 0 ? "up" : "down")}
          </div>
        )}
        {delta != null && (
          <div className="large-box__content-delta">
            <DeltaIndicator
              delta={delta}
              direction={getDeltaDirection(delta)}
              indicatorPos="right"
              formatter={formatDelta}
            />
          </div>
        )}
      </>
    );

    return (
      <LargeBoxLayout
        name={name}
        content={formatValue(value)}
        detail={extraContent}
        detail2={targetFormatter(formatTarget)(target)}
        innerBox={graphDeltaBox}
      />
    );
  }
}

export const PercentageGraphBox = props => (
  <LargeGraphBox
    formatDelta={formatDeltaPercent}
    getDeltaDirection={getPercentageDirection}
    formatTarget={value => formatPercent(value, props.digits || 0)}
    formatValue={value => formatPercent(value, props.digits || 0, 0)}
    {...props}
  />
);

export const CurrencyShorthandGraphBox = props => (
  <LargeGraphBox
    formatDelta={formatCurrencyShorthandWithDigit}
    getDeltaDirection={getDefaultDirection}
    formatTarget={formatCurrencyShorthandWithDigit}
    formatValue={formatCurrencyShorthandWithDigit}
    {...props}
  />
);
