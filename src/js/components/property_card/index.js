import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Button from "../button";
import Panel from "../panel";
import PropertyStatus from "../property_status";
import UserIconList from "../user_icon_list";
import Tick from "../../icons/tick";

import "./property_card.scss";

export const PropertyCard = ({
  property_id,
  property_name,
  address,
  image_url,
  performance_rating,
  url,
  users,
  selected,
  onSelect
}) => {
  const handleToggle = () => {
    onSelect(property_id, !selected);
  };
  const imageStyle = {};
  if (image_url) {
    imageStyle.backgroundImage = `url(${image_url})`;
    imageStyle.backgroundSize = "cover";
  }
  const classes = cn("property-card", {
    "property-card--selected": selected
  });
  return (
    <div className={classes}>
      <Panel className="property-card__panel">
        <div className="property-card__image" style={imageStyle}>
          <div className="property-card__overlay">
            <div className="property-card__overlay-link">
              <div className="property-card__selector" onClick={handleToggle}>
                <Tick className="property-card__selector-tick" />
              </div>
              <a href={url}>
                <Button color="outline">View Report</Button>
              </a>
            </div>
            <div className="property-card__actions">
              <UserIconList users={users} />
            </div>
          </div>
        </div>
        <div className="property-card__body">
          <div className="property-card__name">{property_name}</div>
          <div className="property-card__address">{address}</div>
          <PropertyStatus
            performance_rating={performance_rating}
            className="property-card__status"
          />
        </div>
      </Panel>
    </div>
  );
};

PropertyCard.requiredPropTypes = {
  property_id: PropTypes.string.isRequired,
  property_name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
  performance_rating: PropTypes.number.isRequired,
  users: PropTypes.array,
  url: PropTypes.string.isRequired
};

PropertyCard.propTypes = {
  ...PropertyCard.requiredPropTypes,
  selected: PropTypes.bool,
  onSelect: PropTypes.func
};

PropertyCard.defaultProps = {
  users: [],
  selected: false,
  onSelect: () => {}
};

export default PropertyCard;
