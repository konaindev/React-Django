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

/**
 * Markers to render as children <GoogleMap /> component
 * should be a React component
 */
const ZipcodeText = ({ zipcode }) => (
  <div className="zip-code-text">{zipcode}</div>
);

export class MapWithPolygon extends Component {
  state = {
    zipcodeTextMarkers: null
  };

  /**
   * You can access to Google Maps "map" and "maps" objects here,
   * "yesIWantToUseGoogleMapApiInternals" = true
   */
  onGoogleApiLoaded = google => {
    this.google = google;
    this.zipcodeMarkers = [];
    this.mapBounds = new google.maps.LatLngBounds();

    const uniqZipCodes = this.props.zip_codes.reduce((acc, cur) => {
      const x = acc.find(item => item.zip === cur.zip);
      if (!x) {
        return acc.concat([cur]);
      } else {
        return acc;
      }
    }, []);

    try {
      uniqZipCodes.forEach(({ zip, properties, outline }) => {
        outline = outline || { coordinates: [] };

        if (outline.type === "Polygon") {
          this.renderPolygonOutline(zip, outline.coordinates);
        }
        if (outline.type == "MultiPolygon") {
          // "coordinates" is an array of Polygon coordinate arrays.
          outline.coordinates.forEach(polygonCoords => {
            this.renderPolygonOutline(zip, polygonCoords);
          });
        }
        if (outline.type) {
          this.renderZipCodeLabel(zip, properties);
        }
      });
    } catch (e) {
      console.log("Failed to render zip codes", e);
    }

    // Resize the viewport to contain all zipcode areas.
    google.map.fitBounds(this.mapBounds, 0);

    // trigger render to display zipcode text in each boundary
    this.setState({
      zipcodeTextMarkers: this.zipcodeMarkers
    });
  };

  /**
   * Polygon geometry object
   * https://tools.ietf.org/html/rfc7946#section-3.1.6
   *
   * Extends global map bounds with exterior ring points
   * Interior rings represent holes within the exterior ring
   */
  renderPolygonOutline = (zip, [outerRing, ...innerRings]) => {
    let { google, mapBounds } = this;

    const outerCoords = outerRing.map(([x, y]) => new google.maps.LatLng(y, x));

    const innerCoords = innerRings.map(innerRing =>
      innerRing.map(([x, y]) => new google.maps.LatLng(y, x))
    );

    outerCoords.forEach(point => {
      mapBounds.extend(point);
    });

    let polygon = new google.maps.Polygon({
      map: google.map,
      paths: [outerCoords, ...innerCoords],
      ...stylesForRegionFill
    });
  };

  renderZipCodeLabel = (zip, properties) => {
    if (properties && properties.center) {
      const { center } = properties;

      this.zipcodeMarkers.push(
        <ZipcodeText
          key={`${zip}-${center[1]}-${center[0]}`}
          lat={center[1]}
          lng={center[0]}
          zipcode={zip}
        />
      );
    }
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
      properties: PropTypes.object,
      outline: PropTypes.shape({
        type: PropTypes.string,
        coordinates: PropTypes.array
      })
    })
  ).isRequired
};

export default MapWithPolygon;
