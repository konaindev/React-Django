import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { SelectSearch } from "../select";

import "./google_address.scss";

export default class GoogleAddress extends React.PureComponent {
  static propTypes = {
    companyAddresses: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    ),
    className: PropTypes.string,
    theme: PropTypes.oneOf(["", "highlight"]),
    loadOptions: PropTypes.func.isRequired,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    className: "",
    theme: "highlight",
    placeholder: "Select office..."
  };

  loadOptions = (inputValue, callback) => {
    this.props.loadOptions(inputValue, options => {
      callback([
        {
          label: "Suggested Google Addresses",
          options: options
        }
      ]);
    });
  };

  render() {
    const {
      className,
      theme,
      placeholder,
      companyAddresses,
      loadOptions,
      ...otherProps
    } = this.props;
    const classes = cn("google-address", className);
    const options = [
      {
        label: "Suggested Company Addresses",
        options: companyAddresses
      }
    ];
    return (
      <SelectSearch
        className={classes}
        theme={theme}
        placeholder={placeholder}
        defaultOptions={options}
        loadOptions={this.loadOptions}
        {...otherProps}
      />
    );
  }
}
