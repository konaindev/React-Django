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

  constructor(props) {
    super(props);
  }

  onGoogleApiLoaded = ({ map, maps }) => {
    this.map = map;
    this.maps = maps;

    const {
      center: {
        coordinates: [ lat, lng ]
      },
      radius,
    } = this.props;

    let circle = new maps.Circle({
      strokeColor: '#5147FF',
      strokeOpacity: 1,
      strokeWeight: 1.54,
      fillColor: '#6760e6',  // rgba(103,96,230,0.1);
      fillOpacity: 0.1,
      map: map,
      center: { lat, lng },
      radius: radius * 1609.34
    })

    let centerMarker = new maps.Marker({
      position: { lat, lng },
      map: map,
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#FFF",
        fillOpacity: 1,
        strokeOpacity: 0,
      }
    })

    // map.fitBounds(circle.getBounds());
  }

  getCircle(center, radius) {
    if (!this.maps) {
      return null;
    }

    return 
  }

  render() {
    const {
      center: {
        coordinates: [ lat, lng ]
      },
      radius,
      units,
    } = this.props;

    const centerLatLng = { lat, lng };
    // const circle = this.getCircle(centerLatLng, radius);
    // console.log('*******', circle)

    return (
      <div className="market-size-map">
        <GoogleMap
          bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
          center={centerLatLng}
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
