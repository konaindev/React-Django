import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./close_icon.scss";

export default function CloseIcon(props) {
  const className = cn("close-icon", props.className);
  return <div className={className} onClick={props.onClick} />;
}
CloseIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func
};
