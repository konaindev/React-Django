import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { Close } from "../../icons";
import Input from "../input";

import "./search_input.scss";

class SearchInput extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    inputClass: PropTypes.string,
    placeholder: PropTypes.string,
    theme: PropTypes.oneOf(["", "highlight", "gray"]),
    value: PropTypes.any,
    onSearch: PropTypes.func
  };
  static defaultProps = {
    value: "",
    theme: "",
    onSearch() {}
  };

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = { value: props.value };
  }

  onChange = e => {
    this.setState({ value: e.target.value });
    this.props.onSearch(e.target.value);
  };

  onClose = () => {
    this.setState({ value: "" });
    this.props.onSearch("");
    this.inputRef.current.node.focus();
  };

  render() {
    const { className, inputClass, onSearch, ...props } = this.props;
    const { value } = this.state;
    const classes = cn("search-input-box", className);
    const inputClasses = cn("search-input", inputClass);
    return (
      <div className={classes}>
        <Input
          {...props}
          ref={this.inputRef}
          className={inputClasses}
          type="text"
          value={value}
          onChange={this.onChange}
        />
        {!!value ? (
          <Close className="search-input-close" onClick={this.onClose} />
        ) : null}
      </div>
    );
  }
}

export default SearchInput;
