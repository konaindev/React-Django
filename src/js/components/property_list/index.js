import PropTypes from "prop-types";
import React from "react";
import _sortBy from "lodash/sortBy";
import _get from "lodash/get";

import PropertyRow from "../property_row";

import "./property_list.scss";

class PropertyList extends React.PureComponent {
  static propTypes = {
    properties: PropTypes.arrayOf(
      PropTypes.shape({
        property_id: PropTypes.string.isRequired,
        image_url: PropTypes.string.isRequired,
        property_name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        performance_rating: PropTypes.number.isRequired
      })
    ).isRequired,
    selectionMode: PropTypes.bool,
    onSelect: PropTypes.func,
    selectedProperties: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    selectionMode: false,
    onSelect: () => {},
    selectedProperties: []
  };

  onSelect = (propertyId, value) => {
    let selected;
    if (value) {
      selected = [...this.props.selectedProperties, propertyId];
    } else {
      selected = this.props.selectedProperties.filter(id => id !== propertyId);
    }
    this.props.onSelect(selected);
  };

  get propertiesRows() {
    return this.props.properties.map(property => (
      <div key={property.property_id} className="property-list__row">
        <PropertyRow
          {...property}
          selection_mode={this.props.selectionMode}
          selected={this.props.selectedProperties.includes(
            property.property_id
          )}
          onSelect={this.onSelect}
        />
      </div>
    ));
  }

  render() {
    return <div className="property-list">{this.propertiesRows}</div>;
  }
}

export default PropertyList;
