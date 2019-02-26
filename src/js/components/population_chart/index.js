import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from '../../utils/formatters';
import './population_chart.css';

export class PopulationChart extends Component {
  static propTypes = {
    group_population: PropTypes.number.isRequired,
    segment_population: PropTypes.number.isRequired
  };

  render() {
    const { group_population, segment_population } = this.props;
    const percent = group_population * 100 / segment_population;
    return (
      <div className="population-chart">
        <div className="population-chart__labels">
          <div className="population-chart__label-start">0</div>
          <div className="population-chart__label-end">
            {formatNumber(segment_population)}
          </div>
          <div
            className="population-chart__label-value"
            style={{ left: `${percent}%` }}
          >
            {formatNumber(group_population)}
          </div>
        </div>
        <div className="population-chart__bar">
          <div
            className="population-chart__bar-percent"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="population-chart__dotted-lines">
          <div
            className="population-chart__dotted-diagnoal"
            style={{ left: `${percent}%` }}
          >
            <svg height="40" width="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path d="M0 0 L100 40" strokeDasharray="1" stroke="#2c3646" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default PopulationChart;
