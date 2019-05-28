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
    selected: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    selectionMode: false,
    onSelect: () => {},
    selected: []
  };

  onSelect = (propertyId, value) => {
    const selected = this.selectedProperties;
    if (value) {
      selected[propertyId] = value;
    } else {
      delete selected[propertyId];
    }
    this.props.onSelect(Object.keys(selected));
  };

  get propertiesRows() {
    const selected = this.selectedProperties;
    return this.props.properties.map(property => (
      <div key={property.property_id} className="property-list__row">
        <PropertyRow
          {...property}
          selection_mode={this.props.selectionMode}
          selected={_get(selected, property.property_id, false)}
          onSelect={this.onSelect}
        />
      </div>
    ));
  }

  get selectedProperties() {
    return this.props.selected.reduce((selected, id) => {
      selected[id] = true;
      return selected;
    }, {});
  }

  render() {
    return <div className="property-list">{this.propertiesRows}</div>;
  }
}

export default PropertyList;
