import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import PropertyStatus from "../property_status";

import "./kpi_card.scss";

const KPICard = ({ health, value, name, target }) => {
  const className = cn("kpi-card", {
    "kpi-card--off-track": health === 0,
    "kpi-card--at-risk": health === 1,
    "kpi-card--on-track": health === 2
  });
  return (
    <div className={className}>
      <div className="kpi-card__bar" />
      <div className="kpi-card__health">
        <PropertyStatus performance_rating={health} />
      </div>
      <div className="kpi-card__value">{value}</div>
      <div className="kpi-card__name">{name}</div>
      <div className="kpi-card__target">Target: {target}</div>
    </div>
  );
};
KPICard.propTypes = {
  health: PropTypes.oneOf([0, 1, 2]).isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired
};

export default React.memo(KPICard);
