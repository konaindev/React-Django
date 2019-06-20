import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import Button from "../button";
import "./button_group.scss";

export default class ButtonGroup extends Component {
  static propTypes = {
    value: PropTypes.any,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any,
        label: PropTypes.node
      })
    )
  };

  handleChange = value => () => {
    const { onChange } = this.props;
    onChange && onChange(value);
  };

  render() {
    const { options, value } = this.props;
    return (
      <div className="button-group">
        {options.map((option, index) => (
          <Button
            selected={option.value === value}
            key={index}
            className="button-group__item"
            onClick={this.handleChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  }
}
