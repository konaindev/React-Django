import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Panel from "../panel";
import PropertyStatus from "../property_status";

import "./property_row.scss";

const PropertyRow = ({
  image_url,
  property_name,
  address,
  performance_rating,
  selected,
  selection_mode,
  onSelect,
  className,
  style
}) => {
  const rowClass = cx(
    className,
    "property-row",
    { "property-row--selection-mode": selection_mode },
    { "property-row--selected": selected }
  );

  const imageStyle = {
    backgroundImage: `url("${image_url}")`
  };

  const handleToggle = () => {
    if (selection_mode === true) {
      onSelect(!selected);
    }
  };

  return (
    <Panel className={rowClass} style={style}>
      <div className="property-row__lead" onClick={handleToggle}>
        <div style={imageStyle} className="property-row__image" />
        <div className="property-row__tick" />
      </div>
      <div className="property-row__name">{property_name}</div>
      <div className="property-row__address">{address}</div>
      <PropertyStatus performance_rating={performance_rating} />
    </Panel>
  );
};

PropertyRow.propTypes = {
  image_url: PropTypes.string.isRequired,
  property_name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  performance_rating: PropTypes.number.isRequired,
  selection_mode: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func
};

PropertyRow.defaultProps = {
  selection_mode: false,
  selected: false,
  onSelect: () => {}
};

export default React.memo(PropertyRow);
