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

const CircleRadiusLabel = function({ radius, units }) {
  return (
    <div className="circle-radius-label">
      {`${radius} ${units}`}
    </div>
  )
}

export class MapWithCircle extends Component {

  constructor(props) {
    super(props);

    this.state = {
      textPositionLatLng: null
    };
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

    const centerLatLng = new maps.LatLng(lat, lng);
    const radiusInMeter = radius * 1609.34;

    let circle = new maps.Circle({
      strokeColor: '#5147FF',
      strokeOpacity: 1,
      strokeWeight: 1.54,
      fillColor: '#6760e6',  // rgba(103,96,230,0.1);
      fillOpacity: 0.1,
      map: map,
      center: centerLatLng,
      radius: radiusInMeter
    });
    // map.fitBounds(circle.getBounds());

    let centerMarker = new maps.Marker({
      position: centerLatLng,
      map: map,
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#FFF",
        fillOpacity: 1,
        strokeOpacity: 0,
      }
    });

    const pointOnBorderLatLng = maps.geometry.spherical.computeOffset(centerLatLng, radiusInMeter, 135);
    const pointOnMiddleLatLng = maps.geometry.spherical.computeOffset(centerLatLng, radiusInMeter / 2, 135);

    this.setState({
      textPositionLatLng: pointOnMiddleLatLng
    });

    let borderMarker = new maps.Marker({
      position: pointOnBorderLatLng,
      map: map,
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#FFF',
        fillOpacity: 1,
        strokeOpacity: 0,
      }
    });

    const dashedLineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      strokeWidth: 0.77,
      scale: 1
    };

    const line = new google.maps.Polyline({
      path: [ centerLatLng, pointOnBorderLatLng ],
      map: map,
      strokeColor: '#FFF',
      strokeOpacity: 0,
      icons: [{
        icon: dashedLineSymbol,
        offset: '0',
        repeat: '6px'
      }],
    });
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

    const { textPositionLatLng } = this.state;

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
          { textPositionLatLng &&
            <CircleRadiusLabel
              lat={textPositionLatLng.lat()}
              lng={textPositionLatLng.lng()}
              radius={radius}
              units={units}
            />
          }
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
