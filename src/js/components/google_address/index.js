import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { SelectSearch } from "../select";

import "./google_address.scss";

export default class GoogleAddress extends React.PureComponent {
  static propTypes = {
    companyAddresses: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        street: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string
      })
    ),
    className: PropTypes.string,
    theme: PropTypes.oneOf(["", "highlight"]),
    loadOptions: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    labelCompany: PropTypes.string,
    labelGoogle: PropTypes.string,
    display: PropTypes.oneOf(["full", "partial"]),
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    className: "",
    theme: "highlight",
    placeholder: "Select office...",
    labelCompany: "Suggested Company Addresses",
    labelGoogle: "Suggested Google Addresses",
    display: "full",
    value: "",
    onChange: () => {}
  };

  loadOptions = (inputValue, callback) => {
    this.props.loadOptions(inputValue, options => {
      callback([
        {
          label: this.props.labelGoogle,
          options: options
        }
      ]);
    });
  };

  formatOptionLabel = data => {
    if (data.__isNew__) {
      return data.label;
    }
    const full_display = this.props.display == "full";
    return (
      <div>
        <div className="google-address__street">
          {data.street || this.props.value}
          {full_display && data.street && data.city ? "," : ""}
        </div>
        {full_display && data.city && data.state && (
          <div className="google-address__city">
            {data.city}, {data.state}
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      className,
      theme,
      placeholder,
      companyAddresses,
      loadOptions,
      onChange,
      value,
      ...otherProps
    } = this.props;
    const classes = cn("google-address", className);
    const options = [
      {
        label: this.props.labelCompany,
        options: companyAddresses
      }
    ];
    const object_value = !!value ? { label: value, value } : undefined;
    return (
      <SelectSearch
        className={classes}
        theme={theme}
        placeholder={placeholder}
        defaultOptions={options}
        isCreatable={true}
        loadOptions={this.loadOptions}
        formatOptionLabel={this.formatOptionLabel}
        onChange={onChange}
        value={object_value}
        {...otherProps}
      />
    );
  }
}
