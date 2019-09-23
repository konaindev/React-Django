import React from "react";
import Button from "../button";
import Panel from "../panel";
import PropertyStatus from "../property_status";
import { Link } from "react-router-dom";
import "./property_card.scss";

export const PropertyCard = ({
  property_name,
  address,
  image_url,
  performance_rating,
  url
}) => {
  const imageStyle = {};
  if (image_url) {
    imageStyle.backgroundImage = `url(${image_url})`;
    imageStyle.backgroundSize = "cover";
  }
  console.log("property_card", url);
  return (
    <div className="property-card">
      <Panel className="property-card__panel">
        <div className="property-card__image" style={imageStyle}>
          <div className="property-card__overlay">
            <Link
              className="property-card__overlay-link"
              to={url.replace("https://app.remarkably.io", "")}
            >
              <Button color="outline">View Report</Button>
            </Link>
            <div className="property-card__actions" />
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

export default PropertyCard;
