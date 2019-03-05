import React, { Component } from "react";
import PropTypes from "prop-types";

import DeltaIndicator from "../delta_indicator";
import {
  formatCurrency,
  formatDeltaPercent,
  formatNumber,
  formatPercent
} from "../../utils/formatters";
import "./funnel_box_layout.scss";

class FunnelBaseBox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    target: PropTypes.number.isRequired,
    delta: PropTypes.number.isRequired,
    formatter: PropTypes.func.isRequired,
    deltaFormatter: PropTypes.func.isRequired,
  };

  render() {
    const { name, value, target, delta, formatter, deltaFormatter } = this.props;
    return (
      <div className="funnel-box-layout">
        <div className="funnel-box-layout__left">
          <div className="funnel-box-layout__name">{name}</div>
          <div className="funnel-box-layout__target">
            Target: {formatter(target)}
          </div>
        </div>
        <div className="funnel-box-layout__right">
          <div className="funnel-box-layout__value">
            {formatter(value)}
          </div>
          <div className="funnel-box-layout__delta">
            <DeltaIndicator delta={delta} indicatorPos="right" formatter={deltaFormatter} />
          </div>
        </div>
      </div>
    );
  }
}

export const FunnelNumberBox = props => (
  <FunnelBaseBox
    {...props}
    formatter={formatNumber}
    deltaFormatter={formatNumber}
  />
);

export const FunnelPercentBox = props => (
  <FunnelBaseBox
    {...props}
    formatter={formatPercent}
    deltaFormatter={formatDeltaPercent}
  />
);

export const FunnelCurrencyBox = props => (
  <FunnelBaseBox
    {...props}
    formatter={formatCurrency}
    deltaFormatter={formatCurrency}
  />
);
