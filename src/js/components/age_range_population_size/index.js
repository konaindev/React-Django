import React from "react";
import PropTypes from "prop-types";
import { VictoryPie } from "victory";

import { formatNumber } from "../../utils/formatters";
import "./age_range_population_size.scss";

const unallocatedColor = "#2B343D";

const getPieData = (x, y) => [{ x, y }, { x: "", y: 1 - y }];

export function AgeRangePopulationSize({
  age_group,
  color,
  market_size,
  segment_population
}) {
  return (
    <div className="age-range-population-size">
      <div className="age-range-population-size__chart">
        <VictoryPie
          data={getPieData(age_group, market_size / segment_population)}
          colorScale={[color, unallocatedColor]}
          padding={0}
        />
      </div>
      <div className="age-range-population-size__info">
        <div className="age-range-population-size__age-group">
          Ages {age_group}
        </div>
        <div className="age-range-population-size__market-size">
          {formatNumber(market_size)}
        </div>
        <div className="age-range-population-size__segment">
          Out of {formatNumber(segment_population)}
        </div>
      </div>
    </div>
  );
}

AgeRangePopulationSize.propTypes = {
  age_group: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  market_size: PropTypes.number.isRequired,
  segment_population: PropTypes.number.isRequired
};

export default AgeRangePopulationSize;
