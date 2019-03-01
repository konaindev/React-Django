import React, { Component } from "react";
import PropTypes from "prop-types";
import GoogleMap from 'google-map-react';

import { GOOGLE_MAP_API_KEY, stylesForNightMode } from './map_settings';
import "./market_size_map.scss";


function createMapOptions(maps) {
  return {
    styles: stylesForNightMode
  };
}

export class MapWithCircle extends Component {

  onGoogleApiLoaded = ({ map, maps }) => {

  }

  render() {
    const {
      center: {
        coordinates: [ lat, lng ]
      },
      radius,
      units,
    } = this.props;

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

MapWithCircle.propTypes = {
  center: PropTypes.shape({
    type: PropTypes.string.isRequired,
    coordinates: PropTypes.array.isRequired,
  }).isRequired,
  radius: PropTypes.number.isRequired,
  units: PropTypes.string.isRequired,
};

export default MapWithCircle;
