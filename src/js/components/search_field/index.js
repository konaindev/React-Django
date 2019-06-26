import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { Close, Search } from "../../icons";

import "./search_field.scss";

class SearchField extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    children: PropTypes.node,
    name: PropTypes.string,
    onSubmit: PropTypes.func
  };

  static defaultProps = {
    value: "",
    placeholder: "Search Properties…",
    children: null,
    name: "q",
    onSubmit: () => {}
  };

  constructor(props) {
    super(props);
    let isActive = false;
    if (props.value) {
      isActive = true;
    }
    this.state = { isActive };
  }

  toggleActive = () => {
    this.setState({ isActive: !this.state.isActive }, () => {
      if (this.state.isActive) {
        this.searchInput.value = "";
        this.searchInput.focus();
      } else {
        this.props.onSubmit("");
      }
    });
  };

  onSubmit = e => {
    if (e.key === "Enter") {
      this.props.onSubmit(e.target.value);
    }
  };

  render() {
    const className = cn("search-field", this.props.className, {
      "search-field--active": this.state.isActive
    });
    return (
      <div className={className}>
        <div className="search-field__icon">
          <Close
            className="search-field__icon-close"
            onClick={this.toggleActive}
          />
          <Search
            className="search-field__icon-search"
            onClick={this.toggleActive}
          />
        </div>
        <div className="search-field__input-wrapper">
          <input
            className="search-field__input"
            ref={input => {
              this.searchInput = input;
            }}
            type="text"
            name={this.props.name}
            defaultValue={this.props.value}
            placeholder={this.props.placeholder}
            onKeyPress={this.onSubmit}
          />
        </div>
        <div className="search-field__children">{this.props.children}</div>
      </div>
    );
  }
}

export default SearchField;
