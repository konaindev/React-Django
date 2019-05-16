import PropTypes from "prop-types";
import React from "react";

import Panel from "../panel";
import PropertyStatus from "../property_status";

import "./property_row.scss";

export class PropertyRow extends React.PureComponent {
  static propTypes = {
    image_url: PropTypes.string.isRequired,
    property_name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    performance_rating: PropTypes.number.isRequired
  };
  render() {
    return (
      <Panel>
        <div className="property-row">
          <img className="property-row__image" src={this.props.image_url} />
          <div className="property-row__name">{this.props.property_name}</div>
          <div className="property-row__address">{this.props.address}</div>
          <PropertyStatus performance_rating={this.props.performance_rating} />
        </div>
      </Panel>
    );
  }
}

export default PropertyRow;
