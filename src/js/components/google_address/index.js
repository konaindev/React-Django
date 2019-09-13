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
    onChange: PropTypes.func
  };

  static defaultProps = {
    className: "",
    theme: "highlight",
    placeholder: "Select office...",
    labelCompany: "Suggested Company Addresses",
    labelGoogle: "Suggested Google Addresses",
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
    return (
      <div>
        <div className="google-address__street">{data.street},</div>
        <div className="google-address__city">
          {data.city}, {data.state}
        </div>
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
      ...otherProps
    } = this.props;
    const classes = cn("google-address", className);
    const options = [
      {
        label: this.props.labelCompany,
        options: companyAddresses
      }
    ];
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
        {...otherProps}
      />
    );
  }
}
