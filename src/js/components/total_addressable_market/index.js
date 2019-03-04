import React from "react";
import PropTypes from "prop-types";

import "./total_addressable_market.scss";
import RentToIncomeAnalysis from "../rent_to_income_analysis";
import EstimatedMarketSizeOverview from "../estimated_market_size_overview";
import SegmentOverviewByAge from "../segment_overview_by_age";
import MarketSizeGrowthReach from "../market_size_growth_reach";


export function TotalAddressableMarket({
  location,
  estimated_population,
  rent_to_income,
  segments,
  future_year,
  total,
  average,
}) {

  const propsForMarketSizeGrowthReach = {
    city: location,
    future_year,
    total,
    average,
    market_sizes: segments,
  };

  return (
    <div className="total-addressable-market">
      <RentToIncomeAnalysis {...rent_to_income} />
      
      <EstimatedMarketSizeOverview market_sizes={segments} />
      
      { segments.map((segment, index) => (
        <SegmentOverviewByAge key={index} {...segment} />
      ))}
      
      <MarketSizeGrowthReach {...propsForMarketSizeGrowthReach} />
    </div>
  );
}

TotalAddressableMarket.propTypes = {
  rent_to_income: PropTypes.object.isRequired,
  estimated_population: PropTypes.object.isRequired,
  segments: PropTypes.array.isRequired,
};

export default TotalAddressableMarket;
