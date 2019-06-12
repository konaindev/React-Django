import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Panel from "../panel";
import PropertyStatus from "../property_status";

import "./property_row.scss";

const PropertyRow = ({
  property_id,
  image_url,
  property_name,
  address,
  performance_rating,
  url,
  selected,
  selection_mode,
  onSelect,
  className,
  style,
  onMouseImgEnter,
  onMouseImgLeave
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
      onSelect(property_id, !selected);
    }
  };

  return (
    <Panel className={rowClass} style={style}>
      <div
        className="property-row__selector"
        onClick={handleToggle}
        onMouseEnter={onMouseImgEnter}
        onMouseLeave={onMouseImgLeave}
      >
        <div style={imageStyle} className="property-row__image" />
        <div className="property-row__selector-hover" />
        <div className="property-row__tick" />
      </div>
      <div className="property-row__name">{property_name}</div>
      <div className="property-row__address">{address}</div>
      <div className="property-row__link-container">
        <a className="property-row__link" href={url}>
          View Property
        </a>
      </div>
      <PropertyStatus performance_rating={performance_rating} />
    </Panel>
  );
};

PropertyRow.propTypes = {
  property_id: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
  property_name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  performance_rating: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  selection_mode: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func,
  onMouseImgEnter: PropTypes.func,
  onMouseImgLeave: PropTypes.func
};

PropertyRow.defaultProps = {
  selection_mode: false,
  selected: false,
  onSelect: () => {},
  onMouseImgEnter: () => {},
  onMouseImgLeave: () => {}
};

export default React.memo(PropertyRow);
