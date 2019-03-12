import React, { Component } from "react";
import PropTypes from "prop-types";

import DeltaIndicator from "../delta_indicator";
import Panel from "../panel";
import WhiskerPlot from "../whisker_plot";
import { LargeBoxLayout } from "../large_box_layout";
import {
  formatCurrencyShorthand,
  formatDeltaPercent,
  targetFormatter,
  formatPercent
} from "../../utils/formatters";

export class LargeGraphBox extends Component {
  static propTypes = {
    delta: PropTypes.number,
    extraContent: PropTypes.node,
    name: PropTypes.string.isRequired,
    series: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ),
    target: PropTypes.number,
    value: PropTypes.number.isRequired,
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
      formatTarget
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
    formatTarget={formatPercent}
    formatValue={value => formatPercent(value, props.digits || 0, 0)}
    {...props}
  />
);

export const CurrencyShorthandGraphBox = props => (
  <LargeGraphBox
    formatDelta={formatCurrencyShorthand}
    formatTarget={formatCurrencyShorthand}
    formatValue={formatCurrencyShorthand}
    {...props}
  />
);
