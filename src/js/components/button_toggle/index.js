import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Button from "../button";
import ButtonGroup from "../button_group";
import "./button_toggle.scss";

export function ButtonToggle(props) {
  const {
    onChange,
    label,
    innerLabelChecked,
    innerLabelUnchecked,
    checked
  } = props;

  const handleChange = e => {
    onChange(e.target.checked);
  };

  const tracksClass = cx(
    "toggle-tracks",
    checked ? "toggle-tracks--checked" : "toggle-tracks--unchecked"
  );

  const buttonClass = cx("button", { "button--primary": checked });

  return (
    <label className="button-toggle">
      <input type="checkbox" checked={checked} onChange={handleChange} />

      <span className={tracksClass}>
        <span className="toggle-thumb" />

        <div className="toggle-button-checked">
          <div className="toggle-inner-label">{innerLabelChecked}</div>
        </div>
        <div className="toggle-button-unchecked">
          <div className="toggle-inner-label">{innerLabelUnchecked}</div>
        </div>
      </span>

      <span className="toggle-outer-label">{label}</span>
    </label>
  );
}

ButtonToggle.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  innerLabelChecked: PropTypes.string,
  innerLabelUnchecked: PropTypes.string,
  disabled: PropTypes.bool,
  checked: PropTypes.bool
};

ButtonToggle.defaultProps = {
  onChange: () => {},
  label: "",
  innerLabelChecked: "On",
  innerLabelUnchecked: "Off",
  disabled: false,
  checked: false
};

export default ButtonToggle;
