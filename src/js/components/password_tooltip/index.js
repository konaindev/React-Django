import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { Error, Ok } from "../../icons";
import "./password_tooltip.scss";

export default class PasswordOverlay extends React.PureComponent {
  static propTypes = {
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired
      })
    ),
    password: PropTypes.string,
    errors: PropTypes.object
  };

  static defaultProps = {
    rules: [],
    password: "",
    errors: {}
  };

  renderRules() {
    const { password } = this.props;
    return this.props.rules.map(rule => {
      const error = this.props.errors?.[rule.key];
      const classes = cn("password-tooltip__rule", {
        "password-tooltip__rule--error": password && error,
        "password-tooltip__rule--ok": password && !error
      });
      return (
        <div className={classes} key={rule.key}>
          <div className="password-tooltip__icon password-tooltip__icon--default" />
          <Error className="password-tooltip__icon password-tooltip__icon--error" />
          <Ok className="password-tooltip__icon password-tooltip__icon--ok" />
          <div className="password-tooltip__text">{rule.label}</div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="password-tooltip">
        <div className="password-tooltip__title">Password must:</div>
        <div className="password-tooltip__rules">{this.renderRules()}</div>
      </div>
    );
  }
}
