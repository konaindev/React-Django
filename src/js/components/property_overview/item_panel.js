import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Panel from "../panel";

import "./property_overview.scss";

const ItemPanel = ({ name, value, className }) => (
  <Panel className={cn("property-overview__panel", className)}>
    <div className="property-overview__panel-name">{name}</div>
    <div className="property-overview__panel-value">{value}</div>
  </Panel>
);
ItemPanel.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  className: PropTypes.string
};

export default React.memo(ItemPanel);
