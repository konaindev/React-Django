import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ReactSelect, { components } from "react-select";

import "./select.scss";

function DropdownIndicator(props) {
  return (
    <components.DropdownIndicator {...props}>
      <div className="select__dropdown-arrow" />
    </components.DropdownIndicator>
  );
}

export default function Select(props) {
  const {
    className,
    onChange,
    options,
    value,
    placeholder,
    ...otherProps
  } = props;
  const classes = cn("select", className);
  return (
    <ReactSelect
      className={classes}
      classNamePrefix="select"
      options={options}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      isSearchable={false}
      components={{ DropdownIndicator }}
      {...otherProps}
    />
  );
}
Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ),
  className: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func
};
