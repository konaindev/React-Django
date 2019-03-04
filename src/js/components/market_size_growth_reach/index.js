import React from "react";
import PropTypes from "prop-types";

import "./market_size_growth_reach.scss";
import { formatNumber, formatPercent } from "../../utils/formatters";
import SectionHeader from "../section_header";

export function MarketSizeGrowthReach({
  city,
  market_sizes,
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
      <SectionHeader title={`Est. Market Size, Growth & Reach : ${city}`} />
      <div className="market-size-growth-reach__panel">
        <div className="market-size-growth-reach__table">
          <div className="table__row table__row--head">
            <span>Target Segment</span>
            <span>Est. Market Size</span>
            <span>Unique Site Visitors</span>
            <span>Est. Market Growth</span>
            <span>Est. {future_year} Market Size</span>
          </div>
          {market_sizes.map((size, index) =>
            <div key={index} className="table__row table__row--body">
              <span>Ages {size.age_group.split('-').join(' - ')}</span>
              <span>{formatNumber(size.market_size)}</span>
              <span>{formatNumber(size.usv)}</span>
              <span>{formatPercent(size.growth, 2, 0)}</span>
              <span>{formatNumber(size.future_size)}</span>
            </div>
          )}
        </div>

        <div className="market-size-growth-reach__summary">
          <div className="summary__box">
            <span>Average</span>
            <span>Tenant Age</span>
            <span>{age}</span>
          </div>
          <div className="summary__box">
            <span>Est. Total</span>
            <span>Market Size</span>
            <span>{formatNumber(market_size)}</span>
          </div>
          <div className="summary__box">
            <span>Total Unique</span>
            <span>Site Visitors</span>
            <span>{formatNumber(usv)}</span>
          </div>
          <div className="summary__box">
            <span>Average</span>
            <span>Market Growth</span>
            <span>{formatPercent(growth, 2, 0)}</span>
          </div>
          <div className="summary__box">
            <span>Est. Total {future_year}</span>
            <span>Market Size</span>
            <span>{formatNumber(future_size)}</span>
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
