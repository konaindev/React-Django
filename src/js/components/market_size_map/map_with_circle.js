import React, { Component } from "react";
import PropTypes from "prop-types";
import GoogleMap from 'google-map-react';

import "./market_size_map.scss";
import {
  GOOGLE_MAP_API_KEY,
  DEFAULT_ZOOM,
  stylesForNightMode,
  stylesForRegionFill,
} from './map_settings';
import { convertDistanceToMeter } from "../../utils/formatters";


const createMapOptions = (maps) => ({
  styles: stylesForNightMode,
  zoomControl: false,
  scrollwheel: false,
  fullscreenControl: false,
  scaleControl: false,
});

const RadiusTextRotated = ({ radius, units }) => (
  <div className="radius-text-rotated">
    {`${radius} ${units}`}
  </div>
);

export class MapWithCircle extends Component {

  constructor(props) {
    super(props);

    this.google = null;

    this.state = {
      isGoogleMapLoaded: false,
    };
  }
 
   // google: Object { map, maps }
  onGoogleApiLoaded = (google) => {
    this.google = google;

    this.setState({
      isGoogleMapLoaded: true
    });

    this.drawCircleAndDashedPoints();
  }

  getCenterLatLng() {
    if (false === this.state.isGoogleMapLoaded) {
      return null;
    }

    const { center: { coordinates: [ lat, lng ] } } = this.props;
    return new this.google.maps.LatLng(lat, lng);
  }

  getRadiusInMeter() {
    const { radius, units } = this.props;
    return convertDistanceToMeter(radius, units);
  }

  drawCircleAndDashedPoints() {
    if (false === this.state.isGoogleMapLoaded) {
      return;
    }

    const { google } = this;
    const radiusInMeter = this.getRadiusInMeter();
    const centerLatLng = this.getCenterLatLng();
    const borderLatLng = google.maps.geometry.spherical.computeOffset(centerLatLng, radiusInMeter, 130);

    // circle with blue border and opacity filled
    let circle = new google.maps.Circle({
      map: google.map,
      center: centerLatLng,
      radius: radiusInMeter,
      ...stylesForRegionFill,
    });

    // resize map so that circle is drawn in proper size
    google.map.fitBounds(circle.getBounds(), 0);

    const pointSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: "#FFF",
      fillOpacity: 1,
      strokeOpacity: 0,
    };

    // white point in the center of the circle
    let centerMarker = new google.maps.Marker({
      position: centerLatLng,
      map: google.map,
      icon: pointSymbol
    });

    // white point on the border of the circle
    let borderMarker = new google.maps.Marker({
      position: borderLatLng,
      map: google.map,
      icon: pointSymbol
    });

    // white dashed line connecting these two markers above
    const dashSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      strokeWidth: 0.77,
      scale: 1
    };

    let radiusLine = new google.maps.Polyline({
      path: [ centerLatLng, borderLatLng ],
      map: google.map,
      strokeColor: '#FFF',
      strokeOpacity: 0,
      icons: [{
        icon: dashSymbol,
        offset: '0',
        repeat: '6px'
      }],
    });
  }

  getRadiusTextRotated() {
    if (false === this.state.isGoogleMapLoaded) {
      return null;
    }

    const { google } = this;
    const { radius, units } = this.props;
    const radiusInMeter = this.getRadiusInMeter();
    const centerLatLng = this.getCenterLatLng();
    const middleLatLng = google.maps.geometry.spherical.computeOffset(centerLatLng, radiusInMeter / 2, 130);

    return (
      <RadiusTextRotated
        lat={middleLatLng.lat()}
        lng={middleLatLng.lng()}
        radius={radius}
        units={units}
      />
    )
  }


  render() {
    const customMarkers = this.getRadiusTextRotated();

    return (
      <div className="market-size-map">
        <GoogleMap
          bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY, libraries: 'geometry' }}
          defaultCenter={{ lat: 0, lng: 0 }}
          defaultZoom={DEFAULT_ZOOM}
          options={createMapOptions}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={this.onGoogleApiLoaded}
        >
          { customMarkers }
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
