import React, { Component } from "react";
import PropTypes from "prop-types";
import GoogleMap from 'google-map-react';

import "./market_size_map.scss";
import { GOOGLE_MAP_API_KEY, DEFAULT_ZOOM, stylesForNightMode } from './map_settings';


const createMapOptions = (maps) => ({
  styles: stylesForNightMode,
  zoomControl: false,
  scrollwheel: false,
  fullscreenControl: false,
  scaleControl: false,
});

const ZipCodeLabel = ({ zipCode }) => (
  <div className="zip-code-label">
    {zipCode}
  </div>
);

export class MapWithPolygon extends Component {

  constructor(props) {
    super(props);

    this.google = null;

    this.state = {
      currentZoom: DEFAULT_ZOOM,
      currentCenter: { lat: 0, lng: 0 },
      isGoogleMapLoaded: false,
    };
  }
 
   // google: Object { map, maps }
  onGoogleApiLoaded = (google) => {
    this.google = google;

    this.setState({
      isGoogleMapLoaded: true
    });

    this.drawZipCodeAreas();
  }

  drawZipCodeAreas() {
    if (false === this.state.isGoogleMapLoaded) {
      return;
    }

    const { google } = this;
    const bounds = new google.maps.LatLngBounds();

    // draw each zip code area as polygon
    this.props.zip_codes.forEach(zipCode => {
      const { zip, outline: { type, coordinates } } = zipCode;

      if (type !== 'Polygon') {
        return;
      }

      const paths = coordinates.map(([lat, lng]) => new google.maps.LatLng(lat, lng));
      paths.forEach(point => { bounds.extend(point) });

      let polygon = new google.maps.Polygon({
        map: google.map,
        paths: paths,
        strokeColor: '#5147FF',
        strokeOpacity: 1,
        strokeWeight: 1.54,
        fillColor: '#6760e6',  // rgba(103,96,230,0.1);
        fillOpacity: 0.1,
      });
    });

    // resize map
    google.map.fitBounds(bounds, 0);

    this.setState({
      currentZoom: google.map.zoom,
      currentCenter: {
        lat: google.map.center.lat(),
        lng: google.map.center.lng(),
      }
    });
  }

  getZipCodeLabels() {
    if (false === this.state.isGoogleMapLoaded) {
      return [];
    }

    const { google } = this;

    return this.props.zip_codes.map(zipCode => {
      const { zip, outline: { type, coordinates } } = zipCode;
      const bounds = new google.maps.LatLngBounds();

      const paths = coordinates.map(([lat, lng]) => new google.maps.LatLng(lat, lng));
      paths.forEach(point => { bounds.extend(point) });
      const zipAreaCenter = bounds.getCenter();

      return (
        <ZipCodeLabel
          lat={zipAreaCenter.lat()}
          lng={zipAreaCenter.lng()}
          zipCode={zip}
        />
      );
    });
  }


  render() {
    const { currentCenter, currentZoom } = this.state;
    const customMarkers = this.getZipCodeLabels();

    return (
      <div className="market-size-map">
        <GoogleMap
          bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY, libraries: 'geometry' }}
          center={currentCenter}
          zoom={currentZoom}
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

MapWithPolygon.propTypes = {
  zip_codes: PropTypes.arrayOf(
    PropTypes.shape({
      zip: PropTypes.string.isRequired,
      outline: PropTypes.shape({
        type: PropTypes.string,
        coordinates: PropTypes.array,
      })
    })
  ).isRequired,
};

export default MapWithPolygon;
