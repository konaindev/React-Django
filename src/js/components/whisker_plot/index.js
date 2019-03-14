import React, { Component } from "react";
import PropTypes from "prop-types";
import { VictoryGroup, VictoryArea } from "victory";

/**
 * @class WhiskerPlot
 *
 * @classdesc A simple bar chart with area gradient that plots a whisker series.
 */
export default class WhiskerPlot extends Component {
  static propTypes = {
    direction: PropTypes.oneOf(["up", "down"]),
    series: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ).isRequired
  };

  static defaultProps = {
    direction: "up"
  };

  static maybe = (maybeSeries, direction = "up") => {
    return maybeSeries ? (
      <WhiskerPlot series={maybeSeries} direction={direction} />
    ) : null;
  };

  constructor(props) {
    super(props);
    this.chartData = this.props.series.map((raw, i) => ({
      x: i,
      y: Number(raw)
    }));
    // Here"s some wacky javascript for you to contemplate. :-)
    this.randomName = (((1 + Math.random()) * 0x10000) | 0).toString(16);
  }

  render() {
    const color =
      this.props.direction === "up"
        ? "#65FF00" // $accent-up-color
        : "#FF7632"; // $accent-down-color
    return (
      <VictoryGroup
        padding={0}
        data={this.chartData}
        style={{
          data: {
            stroke: color,
            strokeWidth: "7px",
            fill: `url(#${this.randomName})`
          }
        }}
      >
        <defs>
          <linearGradient
            id={this.randomName}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={color} stopOpacity={1.0} />
            <stop offset="19%" stopColor={color} stopOpacity={0.738} />
            <stop offset="34%" stopColor={color} stopOpacity={0.541} />
            <stop offset="47%" stopColor={color} stopOpacity={0.382} />
            <stop offset="57%" stopColor={color} stopOpacity={0.278} />
            <stop offset="65%" stopColor={color} stopOpacity={0.194} />
            <stop offset="73%" stopColor={color} stopOpacity={0.126} />
            <stop offset="80%" stopColor={color} stopOpacity={0.075} />
            <stop offset="86%" stopColor={color} stopOpacity={0.042} />
            <stop offset="91%" stopColor={color} stopOpacity={0.021} />
            <stop offset="95%" stopColor={color} stopOpacity={0.008} />
            <stop offset="98%" stopColor={color} stopOpacity={0.002} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <VictoryArea interpolation="basis" />
      </VictoryGroup>
    );
  }
}
