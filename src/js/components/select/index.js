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
    defaultValue,
    value,
    placeholder,
    name,
    components,
    ...otherProps
  } = props;
  const classes = cn("select", className);
  return (
    <ReactSelect
      className={classes}
      classNamePrefix="select"
      name={name}
      options={options}
      defaultValue={defaultValue}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      isSearchable={false}
      components={{ DropdownIndicator, ...components }}
      {...otherProps}
    />
  );
}
Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ),
  className: PropTypes.string,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  components: PropTypes.object
};

Select.defaultProps = {
  components: {}
};
