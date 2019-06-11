import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { components } from "react-select";

import Select from "../select";

import "./multi_select.scss";

function Option(props) {
  const classes = cn("multi-select__option", {
    "multi-select__option--selected": props.isSelected
  });
  return (
    <components.Option className={classes} {...props}>
      <div className="multi-select__option-checkbox" />
      <div className="multi-select__option-label">{props.label}</div>
    </components.Option>
  );
}

function ValueContainer({ children, ...props }) {
  if (props.hasValue) {
    return props.selectProps.label;
  } else {
    return (
      <components.ValueContainer {...props}>
        {children}
      </components.ValueContainer>
    );
  }
}

function Control(props) {
  const classes = cn({ "multi-select--has-value": props.hasValue });
  return <components.Control {...props} className={classes} />;
}

export default function MultiSelect(props) {
  const { className, label, ...otherProps } = props;
  const classes = cn("multi-select", className);
  return (
    <Select
      className={classes}
      classNamePrefix="select"
      isClearable={false}
      components={{ Option, ValueContainer, Control }}
      isMulti={true}
      hideSelectedOptions={false}
      label={label}
      loadOptions={() => props.options}
      closeMenuOnSelect={false}
      {...otherProps}
    />
  );
}

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ),
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func
};

MultiSelect.defaultProps = {
  label: "Select..."
};
