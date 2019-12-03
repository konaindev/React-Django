import React from "react";
import cx from "classnames";

const RmbTooltipAnchor = ({ className, ...props }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
    className={cx("rmb-tooltip-anchor", className)}
  >
    <circle cx="10" cy="10" r="10" fill="#181D23" />
    <circle cx="10" cy="10" r="10" fill="#2B343D" />
    <rect x="8" y="5" width="5" height="10" fill="#798796" />
    <path
      d="M10 1C5.0293 1 1 5.0293 1 10C1 14.9707 5.0293 19 10 19C14.9707 19 19 14.9707 19 10C19 5.0293 14.9707 1 10 1ZM10.9 14.5H9.1V9.1H10.9V14.5ZM10.9 7.3H9.1V5.5H10.9V7.3Z"
      fill="#181D23"
    />
  </svg>
);

export default RmbTooltipAnchor;
