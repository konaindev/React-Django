import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { components } from "react-select";

import Checkbox from "../checkbox";
import Select from "../select";

import "./multi_select.scss";

function Option(props) {
  return (
    <components.Option className="multi-select__option" {...props}>
      <Checkbox isSelected={props.isSelected} />
      <div className="multi-select__option-label">{props.label}</div>
    </components.Option>
  );
}

function ValueContainer({ children, ...props }) {
  let label;
  if (props.hasValue) {
    label = (
      <div className="multi-select__label">{props.selectProps.label}</div>
    );
  } else {
    label = (
      <div className="select__placeholder">{props.selectProps.placeholder}</div>
    );
  }
  return (
    <components.ValueContainer {...props}>
      {label}
      {children[1]}
    </components.ValueContainer>
  );
}

function Control(props) {
  const classes = cn({ "multi-select--has-value": props.hasValue });
  return <components.Control {...props} className={classes} />;
}

export default class MultiSelect extends React.PureComponent {
  get options() {
    if (this.props.selectAllLabel) {
      return [
        { label: this.props.selectAllLabel, value: "all" },
        ...this.props.options
      ];
    } else {
      return this.props.options;
    }
  }

  get value() {
    if (this.props.value.length === this.props.options.length) {
      return [
        { label: this.props.selectAllLabel, value: "all" },
        ...this.props.value
      ];
    }
    return this.props.value;
  }

  onChange = (options, field) => {
    if (field.action === "select-option" && field.option.value === "all") {
      this.props.onChange(this.props.options, field);
    } else if (
      field.action === "deselect-option" &&
      field.option.value === "all"
    ) {
      this.props.onChange([], field);
    } else {
      const newOptions = options.filter(o => o.value !== "all");
      return this.props.onChange(newOptions, field);
    }
  };

  render() {
    const {
      className,
      label,
      value,
      options,
      onChange,
      ...otherProps
    } = this.props;
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
        options={this.options}
        closeMenuOnSelect={false}
        value={this.value}
        onChange={this.onChange}
        {...otherProps}
      />
    );
  }
}

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ),
  className: PropTypes.string,
  defaultValue: PropTypes.array,
  value: PropTypes.array,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  selectAllLabel: PropTypes.string
};

MultiSelect.defaultProps = {
  value: [],
  selectAllLabel: "",
  label: "Select..."
};
