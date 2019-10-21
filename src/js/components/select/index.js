import cn from "classnames";
import { Field } from "formik";
import _clone from "lodash/clone";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactSelect from "react-select";

import { DropdownIndicator } from "./select_components";
import "./select.scss";

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
    theme,
    size,
    isMulti,
    ...otherProps
  } = props;
  const classes = cn("select", className, {
    "select--is-multi": isMulti,
    [`select--${size}`]: size,
    [`select--${theme}`]: theme
  });
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
      isMulti={isMulti}
      components={{ DropdownIndicator, ...components }}
      {...otherProps}
    />
  );
}
Select.optionsGroupType = PropTypes.arrayOf(
  PropTypes.shape({
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired
  })
);
Select.optionsType = PropTypes.oneOfType([
  PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired
    })
  ),
  Select.optionsGroupType
]);
Select.propTypes = {
  size: PropTypes.oneOf(["", "small"]),
  theme: PropTypes.oneOf(["", "default", "highlight", "transparent", "gray"]),
  options: Select.optionsType,
  className: PropTypes.string,
  name: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  isMulti: PropTypes.bool,
  components: PropTypes.object
};
Select.defaultProps = {
  size: "",
  theme: "",
  isMulti: false,
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

export { SelectSearch } from "./select_search";
