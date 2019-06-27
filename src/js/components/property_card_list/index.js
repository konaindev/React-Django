import React from "react";
import cn from "classnames";
import PropertyCard from "../property_card";
import "./property_card_list.scss";

export const PropertyCardList = ({ properties }) => {
  if (properties.length === 0) {
    return (
      <div className="property-list">
        All your properties have been filtered out. Remove some of the filters
        above.
      </div>
    );
  }
  return (
    <div className="property-card-list">
      {properties.map((property, index) => (
        <PropertyCard key={index} {...property} />
      ))}
    </div>
  );
};

export default PropertyCardList;
