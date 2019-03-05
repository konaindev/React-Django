import React from "react";
import PropTypes from "prop-types";

import "./total_addressable_market.scss";
import SectionHeader from '../section_header'
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

  return (
    <div className="total-addressable-market">
      <RentToIncomeAnalysis {...rent_to_income} />

      <SectionHeader title={`Detailed market sizing: ${location}`} />
      <EstimatedMarketSizeOverview market_sizes={segments} />

      { segments.map((segment, index) => (
        <SegmentOverviewByAge
          key={index}
          {...segment}
          segment_number={index + 1}
          total_population={total.segment_population}
        />
      ))}

      <MarketSizeGrowthReach
        city={location}
        future_year={future_year}
        total={total}
        average={average}
        market_sizes={segments}
      />
    </div>
  );
}

TotalAddressableMarket.propTypes = {
  rent_to_income: PropTypes.object.isRequired,
  estimated_population: PropTypes.object.isRequired,
  segments: PropTypes.array.isRequired,
  total: PropTypes.object.isRequired,
  average: PropTypes.object.isRequired,
};

export default TotalAddressableMarket;
