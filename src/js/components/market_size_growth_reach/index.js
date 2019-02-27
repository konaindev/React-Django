import React from "react";
import PropTypes from "prop-types";

import "./market_size_growth_reach.scss";
import { formatNumber, formatPercent } from "../../utils/formatters";


export function MarketSizeGrowthReach({
  city,
  future_year,
  average: {
    age,
    growth,
  },
  total: {
    market_size,
    usv,
    future_size,
  }
}) {

  return (
    <div className="market-size-growth-reach">
      <div className="section__header">
        <p>Est. Market Size, Growth & Reach : {city}</p>
        <hr />
      </div>

      <div className="section__panel">

        <div className="panel__summary">
          <div className="summary__grid">
            <div className="grid__box text-left">
              <span>Average</span>
              <span>Tenant Age</span>
              <span>{age}</span>
            </div>
            <div className="grid__box text-right">
              <span>Est. Total</span>
              <span>Market Size</span>
              <span>{formatNumber(market_size)}</span>
            </div>
            <div className="grid__box text-right">
              <span>Total Unique</span>
              <span>Site Visitors</span>
              <span>{formatNumber(usv)}</span>
            </div>
            <div className="grid__box text-right">
              <span>Average</span>
              <span>Market Growth</span>
              <span>{formatPercent(growth, 1)}</span>
            </div>
            <div className="grid__box text-right">
              <span>Est. Total {future_year}</span>
              <span>Market Size</span>
              <span>{formatNumber(future_size)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MarketSizeGrowthReach.propTypes = {
  city: PropTypes.string.isRequired,
  market_sizes: PropTypes.arrayOf(
    PropTypes.shape({
      age_group: PropTypes.string,
      market_size: PropTypes.number,
      usv: PropTypes.number,
      growth: PropTypes.number,
      future_size: PropTypes.number,
    })
  ).isRequired,
  future_year: PropTypes.number.isRequired,
  average: PropTypes.shape({
    age: PropTypes.number,
    growth: PropTypes.number,
  }).isRequired,
  total: PropTypes.shape({
    market_size: PropTypes.number,
    usv: PropTypes.number,
    future_size: PropTypes.number,
  }).isRequired,
};

export default MarketSizeGrowthReach;
