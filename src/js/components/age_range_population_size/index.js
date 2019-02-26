import React from "react";
import PropTypes from "prop-types";

import './age_range_population_size.css';


export function AgeRangePopulationSize({ age_group, market_size, segment_population }) {
  return (
    <div className="age-range-population-size">
      <span>{age_group}</span>
      <span>{market_size}</span>
      <span>Out of {segment_population}</span>
    </div>
  );
}

AgeRangePopulationSize.propTypes = {
  age_group: PropTypes.string.isRequired,
  market_size: PropTypes.number.isRequired,
  segment_population: PropTypes.number.isRequired,
};

export default AgeRangePopulationSize;
