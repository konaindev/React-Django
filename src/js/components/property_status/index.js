import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import "./property_status.scss";

export class PropertyStatus extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    performance_rating: PropTypes.number.isRequired
  };

  static STATUS_LABEL = ["NEEDS REVIEW", "AT RISK", "ON TRACK"];

  get className() {
    return cn("property-status", this.props.className, {
      "property-status--requires-review": this.props.performance_rating === 0,
      "property-status--at-risk": this.props.performance_rating === 1,
      "property-status--on-track": this.props.performance_rating === 2
    });
  }

  render() {
    return (
      <div className={this.className}>
        {PropertyStatus.STATUS_LABEL[this.props.performance_rating]}
      </div>
    );
  }
}

export default PropertyStatus;
