import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

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

  const classes = cx(
    "button-toggle",
    checked ? "button-toggle--checked" : "button-toggle--unchecked"
  );

  const buttonClass = cx("button", { "button--primary": checked });

  return (
    <label className={classes}>
      <input
        className="button-toggle__input"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />

      <span className="button-toggle__track">
        <span className="button-toggle__thumb" />

        <div className="button-toggle__checked">
          <div className="button-toggle__inner-label">{innerLabelChecked}</div>
        </div>
        <div className="button-toggle__unchecked">
          <div className="button-toggle__inner-label">
            {innerLabelUnchecked}
          </div>
        </div>
      </span>

      {label && <span className="button-toggle__outer-label">{label}</span>}
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
