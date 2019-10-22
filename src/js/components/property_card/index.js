import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Button from "../button";
import Panel from "../panel";
import PropertyStatus from "../property_status";
import { Link } from "react-router-dom";
import UserIconList from "../user_icon_list";
import Tick from "../../icons/tick";

import "./property_card.scss";

export const PropertyCard = ({
  public_id,
  property_name,
  address,
  image_url,
  performance_rating,
  members,
  selected,
  onSelect
}) => {
  const handleToggle = () => {
    console.log("------> handle toggle", onSelect);
    onSelect(public_id, !selected);
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
              <Link
                className="property-card__overlay-link"
                to={`/projects/${public_id}`}
              >
                <Button color="outline">View Report</Button>
              </Link>
            </div>
            <div className="property-card__actions">
              <UserIconList users={members} />
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
  public_id: PropTypes.string.isRequired,
  property_name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
  performance_rating: PropTypes.number.isRequired,
  members: PropTypes.array
};

PropertyCard.propTypes = {
  ...PropertyCard.requiredPropTypes,
  selected: PropTypes.bool,
  onSelect: PropTypes.func
};

PropertyCard.defaultProps = {
  members: [],
  selected: false,
  onSelect: () => {}
};

export default PropertyCard;
