import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import { Sort } from "../../icons";
import Select from "../select";

import "./sort_select.scss";

export default class SortSelect extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    direction: PropTypes.oneOf(["asc", "desc"]),
    options: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    ).isRequired,
    value: PropTypes.string.isRequired
  };

  static defaultProps = {
    direction: "asc",
    onChange: () => {}
  };

  onChangeDirection = () => {
    let direction = "asc";
    if (this.props.direction !== "desc") {
      direction = "desc";
    }
    this.props.onChange(this.props.value, direction);
  };

  onChangeSort = options => {
    this.props.onChange(options.value, this.props.direction);
  };

  get value() {
    return this.props.options.find(o => o.value === this.props.value);
  }

  render() {
    const { className, direction, ...otherProps } = this.props;
    const classes = cn("sort-select", className);
    const iconClasses = cn("sort-select__icon", {
      "sort-select__icon--reverse": direction === "desc"
    });
    return (
      <div className={classes}>
        <div className="sort-select__title">SORT:</div>
        <div className="sort-select__field-wrapper">
          <Select
            className="sort-select__field"
            {...otherProps}
            value={this.value}
            onChange={this.onChangeSort}
          />
          <Sort className={iconClasses} onClick={this.onChangeDirection} />
        </div>
      </div>
    );
  }
}
