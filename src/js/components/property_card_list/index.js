import React from "react";
import cn from "classnames";
import PropertyCard from "../property_card";
import "./property_card_list.scss";

export const PropertyCardList = ({ properties }) => (
  <div className="property-card-list">
    {properties.map((property, index) => (
      <PropertyCard key={index} {...property} />
    ))}
  </div>
);

export default PropertyCardList;
