import React from "react";
import cn from "classnames";
import Button from "../button";
import Panel from "../panel";
import "./property_card.scss";

const STATUS_LABEL = [
  "NEEDS REVIEW",
  "AT RISK",
  "ON TRACK",
];

export const PropertyCard = ({
  property_name,
  address,
  image_url,
  performance_rating,
  url
}) => (
  <div className="property-card">
    <Panel className="property-card__panel">
      <div
        className="property-card__image"
        style={{
          backgroundImage: `url(${image_url})`
        }}
      >
        <div className="property-card__overlay">
          <a className="property-card__overlay-link" href={url}>
            <Button color="outline">View Report</Button>
          </a>
          <div className="property-card__actions" />
        </div>
      </div>
      <div className="property-card__body">
        <div className="property-card__name">{property_name}</div>
        <div className="property-card__address">{address}</div>
        <div
          className={cn("property-card__status", {
            "property-card__status--on-track": performance_rating === 2,
            "property-card__status--at-risk": performance_rating === 1,
            "property-card__status--requires-review": performance_rating === 0
          })}
        >
          {STATUS_LABEL[performance_rating]}
        </div>
      </div>
    </Panel>
  </div>
);

export default PropertyCard;
