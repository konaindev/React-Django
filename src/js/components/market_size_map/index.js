import React, { Component } from "react";
import PropTypes from "prop-types";
import GoogleMap from "google-map-react";
import lodashGet from "lodash/get";

import { convertToMeter } from "../../utils/misc";
import {
  GOOGLE_MAP_API_KEY,
  DEFAULT_ZOOM,
  createDefaultMapOptions,
  stylesForRegionFill,
  mapCirclePointColor
} from "./map_settings";
import "./market_size_map.scss";

// markers rendered as children of <GoogleMap /> SHOULD be a React component
const ZipcodeText = ({ zipcode }) => (
  <div className="zip-code-text">{zipcode}</div>
);
const RadiusTextRotated = ({ radius, units }) => (
  <div className="radius-text-rotated">{`${radius} ${units}`}</div>
);
// end of marker components

export class MarketSizeMap extends Component {
  state = {
    isGoogleMapLoaded: false
  };

  /**
   * You can access to Google Maps instance here,
   * @params google: Object { map, maps }
   * <GoogleMap {...props} yesIWantToUseGoogleMapApiInternals ={true} />
   */
  onGoogleApiLoaded = google => {
    this.google = google;

    this.setState({ isGoogleMapLoaded: true }, () => {
      this.renderCircleAndDashedPoints();
      this.renderZipcodePolygons();
    });
  };

  // getters for deteting map display modes
  get isCircleMode() {
    const { radius, units } = this.props;
    return radius != null && units != null;
  }

  get isZipcodeMode() {
    const { zip_codes } = this.props;
    return zip_codes && zip_codes.length > 0;
  }

  get isComplexMode() {
    return this.isCircleMode && this.isZipcodeMode;
  }

  get uniqueZipCodes() {
    if (!this.isZipcodeMode) {
      return [];
    }

    return this.props.zip_codes.reduce((acc, cur) => {
      const x = acc.find(item => item.zip === cur.zip);
      if (!x) {
        return acc.concat([cur]);
      } else {
        return acc;
      }
    }, []);
  }
  // end of getters

  // map with circle
  getCenterLatLng() {
    const {
      center: {
        coordinates: [lng, lat]
      }
    } = this.props;
    return new this.google.maps.LatLng(lat, lng);
  }

  getRadiusInMeter() {
    const { radius, units } = this.props;
    return convertToMeter(radius, units);
  }

  renderCircleAndDashedPoints = () => {
    if (!this.isCircleMode) {
      return;
    }

    const { google } = this;
    const radiusInMeter = this.getRadiusInMeter();
    const centerLatLng = this.getCenterLatLng();
    const borderLatLng = google.maps.geometry.spherical.computeOffset(
      centerLatLng,
      radiusInMeter,
      130
    );

    // circle with blue border and opacity filled
    let circle = new google.maps.Circle({
      map: google.map,
      center: centerLatLng,
      radius: radiusInMeter,
      ...stylesForRegionFill
    });

    // resize map so that circle is drawn in proper size
    google.map.fitBounds(circle.getBounds(), 0);

    const pointSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: mapCirclePointColor,
      fillOpacity: 1,
      strokeOpacity: 0
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
      path: "M 0,-1 0,1",
      strokeOpacity: 1,
      strokeWeight: 2,
      scale: 1
    };

    let radiusLine = new google.maps.Polyline({
      path: [centerLatLng, borderLatLng],
      map: google.map,
      strokeColor: mapCirclePointColor,
      strokeOpacity: 0,
      icons: [
        {
          icon: dashSymbol,
          offset: "0",
          repeat: "6px"
        }
      ]
    });
  };

  renderRadiusMarker = () => {
    if (!this.isCircleMode) {
      return;
    }

    const { radius, units } = this.props;
    const radiusInMeter = this.getRadiusInMeter();
    const centerLatLng = this.getCenterLatLng();
    const middleLatLng = this.google.maps.geometry.spherical.computeOffset(
      centerLatLng,
      radiusInMeter / 2,
      130
    );

    return (
      <RadiusTextRotated
        lat={middleLatLng.lat()}
        lng={middleLatLng.lng()}
        radius={radius}
        units={units}
      />
    );
  };
  // end of map with circle

  // map with zipcodes
  /**
   * Polygon geometry object
   * https://tools.ietf.org/html/rfc7946#section-3.1.6
   *
   * Extends global map bounds with exterior ring points
   * Interior rings represent holes within the exterior ring
   */
  renderPolygonOutline = ([outerRing, ...innerRings]) => {
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

  renderZipcodePolygons = () => {
    if (!this.isZipcodeMode) {
      return;
    }

    this.mapBounds = new this.google.maps.LatLngBounds();

    this.uniqueZipCodes.forEach(({ outline }) => {
      outline = outline || { coordinates: [] };

      if (outline.type === "Polygon") {
        this.renderPolygonOutline(outline.coordinates);
      }
      if (outline.type == "MultiPolygon") {
        // "coordinates" is an array of Polygon coordinate arrays.
        outline.coordinates.forEach(polygonCoords => {
          this.renderPolygonOutline(polygonCoords);
        });
      }
    });

    // Resize the viewport to contain all zipcode areas.
    this.google.map.fitBounds(this.mapBounds, 0);
  };

  renderZipcodeMarkers = () => {
    const zipcodeMarkers = [];

    this.uniqueZipCodes.forEach(({ zip, properties }) => {
      const center = lodashGet(properties, "center");
      // if (!outline.type) {
      if (false === Array.isArray(center)) {
        return;
      }
      zipcodeMarkers.push(
        <ZipcodeText
          key={`${zip}-${center[1]}-${center[0]}`}
          lat={center[1]}
          lng={center[0]}
          zipcode={zip}
        />
      );
    });

    return zipcodeMarkers;
  };
  // end of map with zipcodes

  render() {
    const { isGoogleMapLoaded } = this.state;

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
          {isGoogleMapLoaded && this.renderRadiusMarker()}
          {isGoogleMapLoaded && this.renderZipcodeMarkers()}
        </GoogleMap>
      </div>
    );
  }
}

MarketSizeMap.propTypes = {
  center: PropTypes.shape({
    type: PropTypes.string.isRequired,
    coordinates: PropTypes.array.isRequired
  }),
  radius: PropTypes.number,
  units: PropTypes.string,
  zip_codes: PropTypes.arrayOf(
    PropTypes.shape({
      zip: PropTypes.string.isRequired,
      properties: PropTypes.object,
      outline: PropTypes.shape({
        type: PropTypes.string,
        coordinates: PropTypes.array
      })
    })
  )
};

export default MarketSizeMap;
