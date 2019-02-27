import React from "react";
import PropTypes from "prop-types";

import './market_size_growth_reach.scss';


export function MarketSizeGrowthReach({ city }) {
  return (
    <div className="market-size-growth-reach">
      <div className="market-size-growth-reach__heading">
        <p>Est. Market Size, Growth & Reach : {city}</p>
        <hr />
      </div>

      <div className="market-size-growth-reach__content">

      </div>
    </div>
  );
}

MarketSizeGrowthReach.propTypes = {
  city: PropTypes.string,
  market_sizes: PropTypes.arrayOf(
    PropTypes.shape({
      age_group: PropTypes.string,
      market_size: PropTypes.number,
      usv: PropTypes.number,
      growth: PropTypes.number,
      future_size: PropTypes.number,
    })
  ),
  future_year: PropTypes.number,
  average: PropTypes.shape({
    age: PropTypes.number,
    growth: PropTypes.number,
  }),
  total: PropTypes.shape({
    market_size: PropTypes.number,
    usv: PropTypes.number,
    future_size: PropTypes.number,
  }),
};

export default MarketSizeGrowthReach;
