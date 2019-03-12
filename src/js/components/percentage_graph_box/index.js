import React, { Component } from "react";
import PropTypes from "prop-types";

import DeltaIndicator from "../delta_indicator";
import Panel from "../panel";
import WhiskerPlot from "../whisker_plot";
import { formatPercent, formatTargetPercent } from "../../utils/formatters";
import "./percentage_graph_box.scss";

export class PercentageGraphBox extends Component {
  static propTypes = {
    delta: PropTypes.number,
    extraContent: PropTypes.node,
    name: PropTypes.string.isRequired,
    series: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ),
    target: PropTypes.number,
    value: PropTypes.number.isRequired,
    digits: PropTypes.number
  };
  static defaultProps = {
    digits: 0
  };

  render() {
    const { name, value, delta, target, series, extraContent } = this.props;
    return (
      <Panel className="percentage-graph-box">
        <span className="percentage-graph-box__name">{name}</span>
        <div className="percentage-graph-box__content">
          <span className="percentage-graph-box__value">
            {formatPercent(value, this.props.digits)}
          </span>
          <div className="percentage-graph-box__graph-delta">
            {series && WhiskerPlot.maybe(series, delta >= 0 ? "up" : "down")}
            <DeltaIndicator delta={delta} indicatorPos="right" />
          </div>
        </div>
        <div className="percentage-graph-box__extra">{extraContent}</div>
        <div className="percentage-graph-box__target">
          {formatTargetPercent(target)}
        </div>
      </Panel>
    );
  }
}

export default PercentageGraphBox;
