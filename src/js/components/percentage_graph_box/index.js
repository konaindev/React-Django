import React, { Component } from "react";
import PropTypes from "prop-types";

import DeltaIndicator from "../delta_indicator";
import WhiskerPlot from "../whisker_plot";
import { formatPercent } from "../../utils/formatters";
import "./percentage_graph_box.scss";

export class PercentageGraphBox extends Component {
  static propTypes = {
    delta: PropTypes.number.isRequired,
    extraContent: PropTypes.node,
    name: PropTypes.string.isRequired,
    series: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ),
    target: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  render() {
    const { name, value, delta, target, series, extraContent } = this.props;
    return (
      <div className="percentage-graph-box">
        <span className="percentage-graph-box__name">{name}</span>
        <div className="percentage-graph-box__content">
          <span className="percentage-graph-box__value">
            {formatPercent(value)}
          </span>
          <div className="percentage-graph-box__graph-delta">
            {series && WhiskerPlot.maybe(series, delta >= 0 ? 'up' : 'down')}
            <DeltaIndicator delta={delta} indicatorPos="right" />
          </div>
        </div>
        <div className="percentage-graph-box__extra">
          {extraContent}
        </div>
        <div className="percentage-graph-box__target">
          Target: {formatPercent(target)}
        </div>
      </div>
    );
  }
}

export default PercentageGraphBox;
