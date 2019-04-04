import React from "react";
import PropTypes from "prop-types";
import chunk from "lodash/chunk";
import sumBy from "lodash/sumBy";

import AgeRangePopulationSize from "../age_range_population_size";
import MarketSegmentPieChart, { PIE_COLORS } from "../market_segment_pie_chart";
import Panel from "../panel";
import "./estimated_market_size_overview.scss";

export function EstimatedMarketSizeOverview({ market_sizes }) {
  const total_population = sumBy(market_sizes, "segment_population");
  const market_size = sumBy(market_sizes, "market_size");
  const segments = market_sizes.map(item => ({
    label: item.age_group,
    value: item.market_size / market_size
  }));
  const itemsPerCol = parseInt(market_sizes.length / 2, 10);
  const chunkedMarketSizes = chunk(market_sizes, itemsPerCol);

  return (
    <Panel className="estimated-market-size-overview">
      <div className="estimated-market-size-overview__heading">
        <p>Est. Market Size Overview</p>
      </div>
      <div className="estimated-market-size-overview__content">
        <div className="estimated-market-size-overview__content-left">
          <MarketSegmentPieChart
            colors={PIE_COLORS}
            market_size={market_size}
            total_population={total_population}
            segments={segments}
          />
        </div>
        <div className="estimated-market-size-overview__content-right">
          {chunkedMarketSizes.map((colItems, colIndex) => (
            <div
              key={colIndex}
              className="estimated-market-size-overview__content-col"
            >
              {colItems.map((sizeProps, index) => (
                <AgeRangePopulationSize
                  key={index}
                  color={PIE_COLORS[colIndex * itemsPerCol + index]}
                  {...sizeProps}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Panel>
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
