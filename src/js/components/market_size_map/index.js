import React, { Component } from "react";
import PropTypes from "prop-types";

import "./market_size_map.scss";


export class MarketSizeMap extends Component {

  render() {
    return (
      <div className="market-size-map">
        
      </div>
    );
  }
}

MarketSizeMap.propTypes = {
  center: PropTypes.shape({
    type: PropTypes.string.isRequired,
    coordinates: PropTypes.array.isRequired,
  }),
  radius: PropTypes.number,
  units: PropTypes.string,
  zip_codes: PropTypes.arrayOf({
    zip: PropTypes.string.isRequired,
    outline: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.array,
    })
  })
};

export default MarketSizeMap;
