import React, { Component } from "react";
import PropTypes from "prop-types";
import GoogleMap from "google-map-react";

import "./market_size_map.scss";
import {
  GOOGLE_MAP_API_KEY,
  DEFAULT_ZOOM,
  createDefaultMapOptions,
  stylesForRegionFill
} from "./map_settings";

const ZipcodeText = ({ zipcode }) => (
  <div className="zip-code-text">{zipcode}</div>
);

export class MapWithPolygon extends Component {
  state = {
    zipcodeTextMarkers: null
  };

  onGoogleApiLoaded = google => {
    this.google = google;
    this.zipcodeMarkers = [];
    this.mapBounds = new google.maps.LatLngBounds();

    this.props.zip_codes.forEach(zipcodeData => {
      const {
        zip,
        outline: { type, coordinates }
      } = zipcodeData;

      if (type === "Polygon") {
        this.processPolygon(zip, coordinates);
      }
    });

    google.map.fitBounds(this.mapBounds, 0);

    this.setState({
      zipcodeTextMarkers: this.zipcodeMarkers
    });
  };

  processPolygon = (zip, [outerRing, ...innerRings]) => {
    let { google, zipcodeMarkers, mapBounds } = this;
    const polygonBounds = new google.maps.LatLngBounds();

    const outerCoords = outerRing.map(
      ([lat, lng]) => new google.maps.LatLng(lat, lng)
    );

    const innerCoords = innerRings.map(innerRing =>
      innerRing.map(([lat, lng]) => new google.maps.LatLng(lat, lng))
    );

    outerCoords.forEach(point => {
      mapBounds.extend(point);
      polygonBounds.extend(point);
    });

    let polygon = new google.maps.Polygon({
      map: google.map,
      paths: [outerCoords, ...innerCoords],
      ...stylesForRegionFill
    });

    const polygonCenter = polygonBounds.getCenter();
    const centerCoords = [polygonCenter.lat(), polygonCenter.lng()];
    zipcodeMarkers.push(
      <ZipcodeText
        key={`${zip}-${centerCoords[0]}-${centerCoords[1]}`}
        lat={centerCoords[0]}
        lng={centerCoords[1]}
        zipcode={zip}
      />
    );
  };

  render() {
    const { zipcodeTextMarkers } = this.state;

    return (
      <div className="market-size-map">
        <GoogleMap
          bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY, libraries: "geometry" }}
          defaultCenter={{ lat: 0, lng: 0 }}
          defaultZoom={DEFAULT_ZOOM}
          options={createDefaultMapOptions}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={this.onGoogleApiLoaded}
        >
          {zipcodeTextMarkers}
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
        coordinates: PropTypes.array
      })
    })
  ).isRequired
};

export default MapWithPolygon;
