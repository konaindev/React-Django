import cn from "classnames";
import PropTypes from "prop-types";

import React from "react";

import "./search_field.scss";

class SearchField extends React.PureComponent {
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
    const className = cn("search-field", {
      "search-field--active": this.state.isActive
    });
    return (
      <div className={className}>
        <div className="search-field__icon" onClick={this.toggleActive} />
        <div className="search-field__input-wrapper">
          <input
            className="search-field__input"
            ref={input => {
              this.searchInput = input;
            }}
            type="text"
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

SearchField.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  children: PropTypes.node,
  onSubmit: PropTypes.func
};
SearchField.defaultProps = {
  value: "",
  placeholder: "Search Properties…",
  children: null,
  onSubmit: () => {}
};

export default SearchField;
