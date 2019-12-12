import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import "./rmb_nav_links.scss";

export const RmbNavLinks = ({ options, selected, onChange }) => {
  const handleLinkClick = v => e => {
    e.preventDefault();

    onChange(v);
  };

  return (
    <ul className="rmb-nav-links">
      {options.map(option => (
        <li
          key={option.value}
          className={cx("rmb-nav-links-item", {
            selected: option.value === selected,
            disabled: option.disabled
          })}
        >
          <a href="" onClick={handleLinkClick(option.value)}>
            {option.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

RmbNavLinks.propTypes = {
  options: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

RmbNavLinks.defaultProps = {
  onChange: () => {}
};

export default RmbNavLinks;
