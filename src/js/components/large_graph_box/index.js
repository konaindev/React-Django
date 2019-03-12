import React, { Component } from "react";
import PropTypes from "prop-types";

import DeltaIndicator from "../delta_indicator";
import Panel from "../panel";
import WhiskerPlot from "../whisker_plot";
import {
  formatCurrencyShorthand,
  targetFormatter,
  formatPercent
} from "../../utils/formatters";
import "./large_graph_box.scss";

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
    return (
      <Panel className="large-graph-box">
        <span className="large-graph-box__name">{name}</span>
        <div className="large-graph-box__content">
          <span className="large-graph-box__value">{formatValue(value)}</span>
          <div className="large-graph-box__graph">
            {series && WhiskerPlot.maybe(series, delta >= 0 ? "up" : "down")}
          </div>
          <div className="large-graph-box__delta">
            <DeltaIndicator
              delta={delta}
              indicatorPos="right"
              formatter={formatDelta}
            />
          </div>
        </div>
        <div className="large-graph-box__extra">{extraContent}</div>
        <div className="large-graph-box__target">
          {targetFormatter(formatTarget)(target)}
        </div>
      </Panel>
    );
  }
}

export const PercentageGraphBox = props => (
  <LargeGraphBox
    formatDelta={formatPercent}
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
