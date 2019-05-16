import PropTypes from "prop-types";
import React from "react";

import Panel from "../panel";
import PropertyStatus from "../property_status";

import "./property_row.scss";

const PropertyRow = ({
  image_url,
  property_name,
  address,
  performance_rating
}) => {
  return (
    <Panel>
      <div className="property-row">
        <img className="property-row__image" src={image_url} />
        <div className="property-row__name">{property_name}</div>
        <div className="property-row__address">{address}</div>
        <PropertyStatus performance_rating={performance_rating} />
      </div>
    </Panel>
  );
};

PropertyRow.propTypes = {
  image_url: PropTypes.string.isRequired,
  property_name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  performance_rating: PropTypes.number.isRequired
};

export default React.memo(PropertyRow);
