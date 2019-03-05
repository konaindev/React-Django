import React from "react";
import PropTypes from "prop-types";

import AgeRangePopulationSize from "../age_range_population_size";
import "./estimated_market_size_overview.css";

export function EstimatedMarketSizeOverview({ market_sizes }) {
  return (
    <div className="estimated-market-size-overview">
      <div className="estimated-market-size-overview__heading">
        <p>Est. Market Size Overview</p>
      </div>

      <div className="estimated-market-size-overview__list">
        {market_sizes.map((sizeProps, index) => (
          <AgeRangePopulationSize key={index} {...sizeProps} />
        ))}
      </div>
    </div>
  );
}

EstimatedMarketSizeOverview.propTypes = {
  market_sizes: PropTypes.arrayOf(
    PropTypes.shape({
      age_group: PropTypes.string.isRequired,
      market_size: PropTypes.number.isRequired,
      segment_population: PropTypes.number.isRequired
    })
  ).isRequired
};

export default EstimatedMarketSizeOverview;
