import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Tooltip from "rc-tooltip";

import "rc-tooltip/assets/bootstrap.css";
import "./rmb_tooltip.scss";

export const RMBTooltip = ({ theme, ...props }) => {
  const classes = cn("rmb-tooltip", {
    [`rmb-tooltip--${theme}`]: theme
  });
  return <Tooltip {...props} overlayClassName={classes} />;
};

RMBTooltip.propTypes = {
  theme: PropTypes.oneOf(["", "light"])
};

export default RMBTooltip;
