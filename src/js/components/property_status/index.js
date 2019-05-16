import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./property_status.scss";

const STATUS_LABEL = ["NEEDS REVIEW", "AT RISK", "ON TRACK"];

const PropertyStatus = ({ className, performance_rating }) => {
  const classNames = cn("property-status", className, {
    "property-status--requires-review": performance_rating === 0,
    "property-status--at-risk": performance_rating === 1,
    "property-status--on-track": performance_rating === 2
  });
  return <div className={classNames}>{STATUS_LABEL[performance_rating]}</div>;
};

PropertyStatus.propTypes = {
  className: PropTypes.string,
  performance_rating: PropTypes.number.isRequired
};

export default React.memo(PropertyStatus);
