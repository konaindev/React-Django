import React, { Component } from "react";
import PropTypes from "prop-types";


export class MapWithPolygon extends Component {

  render() {
    return (
      <div>
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
