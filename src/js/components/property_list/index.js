import PropTypes from "prop-types";
import React from "react";

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
    onSelect: PropTypes.func,
    selectedProperties: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    onSelect: () => {},
    selectedProperties: []
  };

  state = {
    selectionMode: false
  };

  onSelect = (propertyId, value) => {
    let selected;
    if (value) {
      selected = [...this.props.selectedProperties, propertyId];
    } else {
      selected = this.props.selectedProperties.filter(id => id !== propertyId);
    }
    this.props.onSelect(selected);
    this.setState({
      selectionMode: !!this.props.selectedProperties.length
    });
  };

  get propertiesRows() {
    const selectionMode =
      this.state.selectionMode || !!this.props.selectedProperties.length;
    return this.props.properties.map(property => (
      <div key={property.property_id} className="property-list__row">
        <PropertyRow
          {...property}
          selection_mode={selectionMode}
          selected={this.props.selectedProperties.includes(
            property.property_id
          )}
          onSelect={this.onSelect}
          onMouseImgEnter={() => this.setState({ selectionMode: true })}
          onMouseImgLeave={() => this.setState({ selectionMode: false })}
        />
      </div>
    ));
  }

  render() {
    return <div className="property-list">{this.propertiesRows}</div>;
  }
}

export default PropertyList;
