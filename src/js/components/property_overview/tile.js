import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Panel from "../panel";

import "./property_overview.scss";

const Tile = ({ name, value, className }) => (
  <Panel className={cn("property-overview__tile", className)}>
    <div className="property-overview__tile-name">{name}</div>
    <div className="property-overview__tile-value">{value}</div>
  </Panel>
);
Tile.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  className: PropTypes.string
};

export default React.memo(Tile);
