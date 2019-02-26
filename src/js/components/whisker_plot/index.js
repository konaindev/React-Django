import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryArea,
  VictoryAxis
} from "victory";

import { remarkablyChartTheme } from "../../utils/victoryTheme";

/**
 * @class WhiskerPlot
 *
 * @classdesc A simple bar chart with area gradient that plots a whisker series.
 */
export default class WhiskerPlot extends Component {
  static propTypes = {
    series: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ).isRequired
  };

  static maybe = maybeSeries => {
    return maybeSeries ? <WhiskerPlot series={maybeSeries} /> : null;
  };

  constructor(props) {
    super(props);
    this.chartData = this.props.series.map((raw, i) => ({
      x: i,
      y: Number(raw)
    }));
    // Here's some wacky javascript for you to contemplate. :-)
    this.randomName = (((1 + Math.random()) * 0x10000) | 0).toString(16);
  }

  render() {
    return (
      <VictoryGroup
        padding={0}
        data={this.chartData}
        style={{
          data: {
            stroke: "#74EC98",
            strokeWidth: "7px",
            fill: `url(#${this.randomName})`
          }
        }}
      >
        {/* XXX TODO this causes a ton of very mysterious console error spew. FIXME -Dave */}
        <defs>
          <linearGradient
            id={this.randomName}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#74EC98" stopOpacity={1.0} />
            <stop offset="19%" stopColor="#74EC98" stopOpacity={0.738} />
            <stop offset="34%" stopColor="#74EC98" stopOpacity={0.541} />
            <stop offset="47%" stopColor="#74EC98" stopOpacity={0.382} />
            <stop offset="57%" stopColor="#74EC98" stopOpacity={0.278} />
            <stop offset="65%" stopColor="#74EC98" stopOpacity={0.194} />
            <stop offset="73%" stopColor="#74EC98" stopOpacity={0.126} />
            <stop offset="80%" stopColor="#74EC98" stopOpacity={0.075} />
            <stop offset="86%" stopColor="#74EC98" stopOpacity={0.042} />
            <stop offset="91%" stopColor="#74EC98" stopOpacity={0.021} />
            <stop offset="95%" stopColor="#74EC98" stopOpacity={0.008} />
            <stop offset="98%" stopColor="#74EC98" stopOpacity={0.002} />
            <stop offset="100%" stopColor="#74EC98" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        {/* I don't really know what interpolation we'll like best. This looks nice for now. */}
        <VictoryArea interpolation="basis" />
      </VictoryGroup>
    );
  }
}
