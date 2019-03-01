import React, { Component } from "react";
import PropTypes from "prop-types";
import GoogleMap from 'google-map-react';

import { stylesForNightMode } from './map_styles';
import "./market_size_map.scss";

const GOOGLE_MAP_API_KEY = 'AIzaSyBu4HU8t3rRXnfdkNjSV1_PIhzzrFFlVTs';


export class MarketSizeMap extends Component {

  onGoogleApiLoaded = ({ map, maps }) => {
  }

  render() {
    const {
      center: {
        coordinates: [ lat, lng ]
      },
      radius,
      zip_codes
    } = this.props;

    const isCircleMode = zip_codes === undefined;

    return (
      <div className="market-size-map">
        <GoogleMap
          bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
          center={{ lat, lng }}
          zoom={12}
          options={createMapOptions}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={this.onGoogleApiLoaded}
        >
        </GoogleMap>
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

function createMapOptions(maps) {
  return {
    styles: stylesForNightMode
  };
}


export default MarketSizeMap;
