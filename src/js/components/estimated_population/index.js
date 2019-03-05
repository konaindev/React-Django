import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from '../../utils/formatters';

import './estimated_population.scss';

export const EstimatedPopulation = ({ population, radius, units, zip_codes }) => {
  const roundedPop = formatNumber(Math.round(population / 1000) * 1000);
  return (
    <div className="estimated-population">
      <div className="estimated-population__title">
        Est. Population
      </div>

      <div className="estimated-population__figure">
        {formatNumber(population)}
      </div>

      <div className="estimated-population__text">
        {radius && units ? (
          <>
            Figures obtained through the latest US Census show that the immediate {radius}{' '}
            {units} area around the site has approx. {roundedPop}{' '}
            total inhabitants.
          </>
        ) : (
          <>
            Figures obtained through the latest US Census show that the selected zip codes have approx.{' '}
            {roundedPop} total inhabitants.
          </>
        )}
      </div>
    </div>
  );
}

EstimatedPopulation.propTypes = {
  population: PropTypes.number.isRequired,
  radius: PropTypes.number,
  units: PropTypes.string,
  zip_codes: PropTypes.array,
};

export default EstimatedPopulation;
