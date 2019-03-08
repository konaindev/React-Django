import React, { Component } from "react";
import PropTypes from "prop-types";

import DeltaIndicator from "../delta_indicator";
import {
  formatCurrency,
  formatDeltaPercent,
  formatNumber,
  formatPercent,
  formatTargetPercent
} from "../../utils/formatters";
import { isNil } from "../../utils/helpers";
import "./funnel_box_layout.scss";

class FunnelBaseBox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    target: PropTypes.number.isRequired,
    delta: PropTypes.number.isRequired,
    formatter: PropTypes.func.isRequired,
    targetFormatter: PropTypes.func.isRequired,
    deltaFormatter: PropTypes.func.isRequired
  };

  render() {
    const {
      name,
      value,
      target,
      delta,
      formatter,
      deltaFormatter,
      targetFormatter
    } = this.props;
    return (
      <div className="funnel-box-layout">
        <div className="funnel-box-layout__left">
          <div className="funnel-box-layout__name">{name}</div>
          {!isNil(target) && (
            <div className="funnel-box-layout__target">
              {targetFormatter(target)}
            </div>
          )}
        </div>
        <div className="funnel-box-layout__right">
          <div className="funnel-box-layout__value">{formatter(value)}</div>
          {!isNil(delta) && (
            <div className="funnel-box-layout__delta">
              <DeltaIndicator
                delta={delta}
                indicatorPos="right"
                formatter={deltaFormatter}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export const FunnelNumberBox = props => (
  <FunnelBaseBox
    formatter={formatNumber}
    deltaFormatter={formatNumber}
    targetFormatter={formatTargetPercent}
    {...props}
  />
);

export const FunnelPercentBox = props => (
  <FunnelBaseBox
    formatter={formatPercent}
    deltaFormatter={formatDeltaPercent}
    targetFormatter={formatTargetPercent}
    {...props}
  />
);

export const FunnelCurrencyBox = props => (
  <FunnelBaseBox
    formatter={formatCurrency}
    deltaFormatter={formatCurrency}
    targetFormatter={formatTargetPercent}
    {...props}
  />
);
