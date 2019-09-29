import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { Alarm } from "../../icons";
import PropertyStatus from "../property_status";
import Tooltip from "../rmb_tooltip";

import "./kpi_card.scss";

const KPICard = ({ health, value, name, target, className }) => {
  const classes = cn("kpi-card", className, {
    "kpi-card--not-available": health === -1,
    "kpi-card--off-track": health === 0,
    "kpi-card--at-risk": health === 1,
    "kpi-card--on-track": health === 2
  });
  return (
    <div className={classes}>
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
  name: PropTypes.string.isRequired,
  health: PropTypes.oneOf([-1, 0, 1, 2]).isRequired,
  value: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired
};

export const NoValueKPICard = ({ name, className }) => {
  const classes = cn(
    "kpi-card kpi-card--no-data kpi-card--no-value",
    className
  );
  const text = (
    <div className="kpi-card__alarm-text">
      No data found for this reporting period.
    </div>
  );
  return (
    <div className={classes}>
      <div className="kpi-card__bar" />
      <div className="kpi-card__no-data">No Data</div>
      <div className="kpi-card__alarm">
        <Tooltip placement="top" theme="light-dark" overlay={text}>
          <div className="kpi-card__alarm-icon-wrap">
            <Alarm className="kpi-card__alarm-icon" />
          </div>
        </Tooltip>
      </div>
      <div className="kpi-card__name">{name}</div>
    </div>
  );
};
NoValueKPICard.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};

export const NoTargetKPICard = ({ name, className, value }) => {
  const classes = cn(
    "kpi-card kpi-card--no-data kpi-card--no-target",
    className
  );
  const text = (
    <div className="kpi-card__alarm-text">
      No targets found for this reporting period.
    </div>
  );
  return (
    <div className={classes}>
      <div className="kpi-card__bar" />
      <div className="kpi-card__no-data">No Data</div>
      <div className="kpi-card__value">{value}</div>
      <div className="kpi-card__name">{name}</div>
      <div className="kpi-card__alarm">
        <Tooltip placement="bottom" theme="light-dark" overlay={text}>
          <div className="kpi-card__alarm-icon-wrap">
            <Alarm className="kpi-card__alarm-icon" />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
NoTargetKPICard.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default React.memo(KPICard);
