import React, { Component } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { formatNumber, formatPercent } from "../../utils/formatters";
import { VictoryLabel, VictoryPie, VictoryTooltip, Flyout } from "victory";
import scssVars from "../../../css/variables.scss";
import "./market_segment_pie_chart.scss";

export const PIE_COLORS = [
  scssVars.pieColor1,
  scssVars.pieColor2,
  scssVars.pieColor3,
  scssVars.pieColor4,
  scssVars.pieColor5,
  scssVars.pieColor6
];

const TOOLTIP_FLYOUT_STYLE = {
  borderColor: "none",
  fill: "#2b343d" // $tooltip-bg-color
};

const TOOLTIP_LABEL_STYLE = {
  padding: 24,
  fontWeight: 600,
  fill: "#f5faf7" // $tooltip-text-color
};

const getPieData = segments =>
  segments.map((item, index) => ({
    x: index + 1,
    y: item.value,
    label: `AGES ${item.label}: ${formatPercent(item.value)}`
  }));

export default class MarketSegmentPieChart extends Component {
  static propTypes = {
    market_size: PropTypes.number.isRequired,
    total_population: PropTypes.number.isRequired,
    segments: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
      })
    ).isRequired
  };

  render() {
    const { market_size, segments, total_population } = this.props;
    return (
      <div className="market-segment-pie-chart">
        <div className="market-segment-pie-chart__stats">
          <div className="market-segment-pie-chart__title">
            EST. Total Market Size
          </div>
          <div className="market-segment-pie-chart__market-size">
            {formatNumber(market_size)}
          </div>
          <div className="market-segment-pie-chart__total">
            Out of {formatNumber(total_population)}
          </div>
        </div>
        <VictoryPie
          innerRadius={140}
          labelComponent={
            <VictoryTooltip
              style={TOOLTIP_LABEL_STYLE}
              flyoutStyle={TOOLTIP_FLYOUT_STYLE}
            />
          }
          colorScale={PIE_COLORS}
          padding={0}
          data={getPieData(segments)}
        />
      </div>
    );
  }
}
