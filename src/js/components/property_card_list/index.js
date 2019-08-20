import PropTypes from "prop-types";
import React from "react";

import PropertyCard from "../property_card";

import "./property_card_list.scss";

export default class PropertyCardList extends React.PureComponent {
  static propTypes = {
    properties: PropTypes.arrayOf(
      PropTypes.shape(PropertyCard.requiredPropTypes)
    ).isRequired,
    onSelect: PropTypes.func,
    selectedProperties: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    onSelect: () => {},
    selectedProperties: []
  };

  onSelect = (propertyId, value) => {
    const { selectedProperties, onSelect } = this.props;
    let selected;
    if (value) {
      selected = [...selectedProperties, propertyId];
    } else {
      selected = selectedProperties.filter(id => id !== propertyId);
    }
    onSelect(selected);
    this.setState({
      selectionMode: !!selectedProperties.length
    });
  };

  render() {
    const { properties, selectedProperties } = this.props;
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
          <PropertyCard
            key={index}
            {...property}
            selected={selectedProperties.includes(property.property_id)}
            onSelect={this.onSelect}
          />
        ))}
      </div>
    );
  }
}
