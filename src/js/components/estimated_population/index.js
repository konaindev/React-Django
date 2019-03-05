import React from "react";
import PropTypes from "prop-types";

import { formatNumber } from "../../utils/formatters";
import MarketSizeMap from "../market_size_map";

import "./estimated_population.scss";


export function EstimatedPopulation(props) {
  return (
    <div className="estimated-population">
      <div className="estimated-population__figure-wrapper">
        <InfoBox {...props} />
      </div>

      <div className="estimated-population__map-wrapper">
        <MarketSizeMap {...props} />
      </div>
    </div>
  );
}

export function InfoBox({ population, radius, units, zip_codes }) {
  const roundedPopulation = formatNumber(Math.round(population / 1000) * 1000);
  const isCircleMode = zip_codes === undefined;

  return (
    <div className="estimated-population__figure">
      <div className="figure__label">
        Est. Population
      </div>

      <div className="figure__value">
        {formatNumber(population)}
      </div>

      <div className="figure__description">
        {isCircleMode ? (
          <>
            Figures obtained through the latest US Census show that the immediate {radius}{' '}
            {units} area around the site has approx. {roundedPopulation}{' '}
            total inhabitants.
          </>
        ) : (
          <>
            Figures obtained through the latest US Census show that the selected zip codes have approx.{' '}
            {roundedPopulation} total inhabitants.
          </>
        )}
      </div>
    </div>
  );
};

EstimatedPopulation.propTypes = {
  population: PropTypes.number.isRequired,
  radius: PropTypes.number,
  units: PropTypes.string,
  zip_codes: PropTypes.array
};

export default EstimatedPopulation;
