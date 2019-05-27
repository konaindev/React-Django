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
        image_url: PropTypes.string.isRequired,
        property_name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        performance_rating: PropTypes.number.isRequired
      })
    ).isRequired,
    selectionMode: PropTypes.bool,
    onSelect: PropTypes.func
  };

  static defaultProps = {
    selectionMode: false,
    onSelect: () => {}
  };

  state = {
    selected: {}
  };

  onSelect = (i, value) => {
    const selected = { ...this.state.selected };
    selected[i] = value;
    this.setState({ selected });
    const selectedProperties = [];
    const properties = this.sortedProperties;
    Object.keys(selected).forEach(i => {
      if (selected[i]) {
        selectedProperties.push(properties[i]);
      }
    });
    this.props.onSelect(selectedProperties);
  };

  get sortedProperties() {
    return _sortBy(this.props.properties, property => property.property_name);
  }

  get propertiesRows() {
    return this.sortedProperties.map((property, i) => (
      <div key={i} className="property-list__row">
        <PropertyRow
          {...property}
          selection_mode={this.props.selectionMode}
          selected={_get(this.state.selected, i, false)}
          onSelect={value => this.onSelect(i, value)}
        />
      </div>
    ));
  }

  render() {
    return <div className="property-list">{this.propertiesRows}</div>;
  }
}

export default PropertyList;
