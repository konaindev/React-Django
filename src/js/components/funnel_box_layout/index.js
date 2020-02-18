import React, { Component } from "react";
import PropTypes from "prop-types";

import DeltaIndicator from "../delta_indicator";
import { InfoTooltip } from "../rmb_tooltip";
import {
  formatCurrency,
  formatDeltaPercent,
  formatNumber,
  formatPercent,
  formatTargetCurrency,
  formatTargetPercent
} from "../../utils/formatters";
import { getDefaultDirection, getPercentageDirection } from "../../utils/misc";
import "./funnel_box_layout.scss";

export class FunnelBaseBox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    infoTooltip: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    target: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    delta: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
      getDeltaDirection,
      targetFormatter,
      infoTooltip
    } = this.props;
    return (
      <div className="funnel-box-layout">
        <div className="funnel-box-layout__badge">On Track</div>
        <div className="funnel-box-layout__wrapper">
          <div className="funnel-box-layout__left">
            <div className="funnel-box-layout__name">
              {name}
              <InfoTooltip transKey={infoTooltip} />
            </div>
            {target != null && (
              <div className="funnel-box-layout__target">
                {targetFormatter(target)}
              </div>
            )}
          </div>
          <div className="funnel-box-layout__right">
            <div className="funnel-box-layout__value">{formatter(value)}</div>
            {delta != null && (
              <div className="funnel-box-layout__delta">
                <DeltaIndicator
                  delta={delta}
                  direction={getDeltaDirection(delta)}
                  indicatorPos="right"
                  formatter={deltaFormatter}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export const FunnelNumberBox = props => (
  <FunnelBaseBox
    formatter={formatNumber}
    deltaFormatter={formatNumber}
    getDeltaDirection={getDefaultDirection}
    targetFormatter={formatTargetPercent}
    {...props}
  />
);

export const FunnelPercentBox = props => (
  <FunnelBaseBox
    formatter={formatPercent}
    deltaFormatter={formatDeltaPercent}
    getDeltaDirection={getPercentageDirection}
    targetFormatter={formatTargetPercent}
    {...props}
  />
);

export const FunnelCurrencyBox = props => (
  <FunnelBaseBox
    formatter={formatCurrency}
    deltaFormatter={formatCurrency}
    getDeltaDirection={getDefaultDirection}
    targetFormatter={formatTargetCurrency}
    {...props}
  />
);
