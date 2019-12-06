import cn from "classnames";
import { Field } from "formik";
import PropTypes from "prop-types";
import React from "react";

import "./input.scss";

export default class Input extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    theme: PropTypes.oneOf(["", "highlight", "gray"]),
    valueFormatter: PropTypes.func,
    onChange: PropTypes.func
  };

  static defaultProps = {
    type: "text",
    valueFormatter: v => v,
    onChange() {}
  };

  setNode = node => {
    this.node = node;
  };

  onChange = e => {
    e.target.value = this.props.valueFormatter(e.target.value);
    this.props.onChange(e);
  };

  render() {
    const { className, theme, valueFormatter, ...otherProps } = this.props;
    const classes = cn("input", className, {
      [`input--${theme}`]: theme
    });
    return (
      <input
        className={classes}
        type={this.props.type}
        {...otherProps}
        ref={this.setNode}
        onChange={this.onChange}
      />
    );
  }
}

export function FormInput(props) {
  const { className, ...otherProps } = props;
  const classes = cn("input", className);
  return (
    <Field
      className={classes}
      type={props.type}
      component="input"
      {...otherProps}
    />
  );
}
FormInput.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string
};
