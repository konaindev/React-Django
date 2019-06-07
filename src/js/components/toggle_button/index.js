import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./toggle_button.scss";

export default class ToggleButton extends Component {
  static propTypes = {
    value: PropTypes.any,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any,
        icon: PropTypes.func
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
      <div className="toggle-button">
        {options.map((option, index) => {
          const Icon = option.icon;
          return (
            <button
              key={index}
              className={cn("toggle-button__item", {
                "toggle-button__item--selected": option.id === value
              })}
              onClick={this.handleChange(option.id)}
            >
              <Icon width={20} height={20} />
            </button>
          );
        })}
      </div>
    );
  }
}
