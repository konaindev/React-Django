import cn from "classnames";
import { Field } from "formik";
import _clone from "lodash/clone";
import PropTypes from "prop-types";
import React, { Component } from "react";
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
  value: PropTypes.object,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  components: PropTypes.object
};
Select.defaultProps = {
  components: {}
};

export function FormSelect(props) {
  return <Field component={FormSelectComponent} {...props} />;
}
FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.object,
  placeholder: PropTypes.string
};

class FormSelectComponent extends Component {
  onChange = obj => {
    const { field, form } = this.props;
    const values = _clone(form.values);
    values[field.name] = obj;
    form.setValues(values);
  };

  onBlur = () => {
    const { field, form } = this.props;
    const touched = _clone(form.touched);
    touched[field.name] = true;
    form.setTouched(touched);
  };

  render() {
    const { form, field, ...otherProps } = this.props;
    return (
      <Select
        name={field.name}
        value={field.value}
        onChange={this.onChange}
        onBlur={this.onBlur}
        {...otherProps}
      />
    );
  }
}
