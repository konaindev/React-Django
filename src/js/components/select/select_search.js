import PropTypes from "prop-types";
import cn from "classnames";
import React from "react";
import AsyncCreatable from "react-select/async-creatable";

import {
  DropdownIndicator,
  FormatCreateLabel,
  OptionWithAdd as Option
} from "./select_components";

export class SelectSearch extends React.PureComponent {
  static propTypes = {
    loadOptions: PropTypes.func.isRequired,
    className: PropTypes.string,
    name: PropTypes.string,
    theme: PropTypes.oneOf(["", "default", "highlight", "transparent", "gray"]),
    isMulti: PropTypes.bool,
    components: PropTypes.object,
    styles: PropTypes.object,
    cacheOptions: PropTypes.bool,
    placeholder: PropTypes.string,
    defaultOptions: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    value: PropTypes.object,
    isCreatable: PropTypes.bool,
    onCreateOption: PropTypes.func,
    onChange: PropTypes.func
  };

  static defaultProps = {
    className: "",
    name: "",
    theme: "",
    isMulti: false,
    components: {},
    styles: {},
    cacheOptions: true,
    defaultOptions: true,
    isCreatable: false,
    placeholder: "Select...",
    onChange: () => {}
  };

  isValidNewOption = (inputValue, selectValue, selectOptions) => {
    const groupOptions =
      selectOptions?.[0]?.options && selectOptions[0].options.length;
    return (!selectOptions.length || !groupOptions) && this.props.isCreatable;
  };

  components = {
    Option,
    DropdownIndicator,
    LoadingIndicator: () => null
  };

  render() {
    const {
      className,
      placeholder,
      name,
      components,
      theme,
      styles,
      cacheOptions,
      loadOptions,
      defaultOptions,
      onChange,
      onCreateOption,
      value,
      isMulti,
      selectSearchRef,
      ...otherProps
    } = this.props;
    const classes = cn("select-search", "select", className, {
      "select--is-multi": isMulti,
      [`select--${theme}`]: theme
    });
    return (
      <AsyncCreatable
        className={classes}
        classNamePrefix="select"
        name={name}
        components={{
          ...this.components,
          ...components
        }}
        ref={selectSearchRef}
        isMulti={isMulti}
        formatCreateLabel={FormatCreateLabel}
        isValidNewOption={this.isValidNewOption}
        loadOptions={loadOptions}
        cacheOptions={cacheOptions}
        placeholder={placeholder}
        defaultOptions={defaultOptions}
        styles={{
          input: () => {},
          ...styles
        }}
        value={value}
        onChange={onChange}
        onCreateOption={onCreateOption}
        {...otherProps}
      />
    );
  }
}
