import React from "react";
import Tooltip from "rc-tooltip";

import "rc-tooltip/assets/bootstrap.css";
import "./rmb_tooltip.scss";

export const RMBTooltip = props => {
  return <Tooltip {...props} overlayClassName="rmb-tooltip" />;
};

export default RMBTooltip;
