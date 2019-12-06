import PropTypes from "prop-types";
import React from "react";

import PropertyRow from "../property_row";

import "./property_list.scss";
import PropertyCard from "../property_card";

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
    selectedProperties: PropTypes.arrayOf(
      PropTypes.shape(PropertyCard.requiredPropTypes)
    ),
    disableSelection: PropTypes.boolean
  };

  static defaultProps = {
    onSelect: () => {},
    selectedProperties: [],
    disableSelection: false
  };

  state = {
    selectionMode: false
  };

  onSelect = (propertyId, value) => {
    let selected;
    if (value) {
      const property = this.props.properties.find(
        p => p.property_id === propertyId
      );
      selected = [...this.props.selectedProperties, property];
    } else {
      selected = this.props.selectedProperties.filter(
        p => p.property_id !== propertyId
      );
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
          disableSelection={this.props.disableSelection}
          selection_mode={selectionMode}
          selected={this.props.selectedProperties.some(
            p => p.property_id === property.property_id
          )}
          onSelect={this.onSelect}
          onMouseImgEnter={() => this.setState({ selectionMode: true })}
          onMouseImgLeave={() => this.setState({ selectionMode: false })}
        />
      </div>
    ));
  }

  render() {
    if (this.props.properties.length === 0) {
      return (
        <div className="property-list">
          0 search results found. Remove some of the search terms entered above.
        </div>
      );
    }
    return <div className="property-list">{this.propertiesRows}</div>;
  }
}

export default PropertyList;
