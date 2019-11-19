import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Tooltip from "rc-tooltip";
import { Link } from "react-router-dom";
import { NavLink } from "../../icons";
import Button from "../button";

import "rc-tooltip/assets/bootstrap.css";
import "./rmb_tooltip.scss";

export const RMBTooltip = props => {
  let overlay = props.overlay;
  if (props.text) {
    overlay = props.text;
  }
  if (props.link) {
    overlay = (
      <React.Fragment>
        <div className="rmb-tooltip__text">{overlay}</div>
        <Link
          style={{ color: "inherit", textDecoration: "inherit" }}
          className="rmb-tooltip__link"
          to={props.link}
        >
          <Button className="rmb-tooltip__button" fullWidth={true}>
            <span className="rmb-tooltip__button-text">Learn More</span>
            <NavLink className="rmb-tooltip__button-icon" />
          </Button>
        </Link>
      </React.Fragment>
    );
  }
  const classes = cn("rmb-tooltip", props.overlayClassName, {
    [`rmb-tooltip--${props.theme}`]: props.theme
  });
  return <Tooltip {...props} overlay={overlay} overlayClassName={classes} />;
};

RMBTooltip.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
  theme: PropTypes.oneOf(["", "highlight", "dark", "light-dark"]),
  overlayClassName: PropTypes.string
};

export default RMBTooltip;

export { default as TooltipAnchor } from "./rmb_tooltip_anchor";
