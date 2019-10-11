import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./button_toggle.scss";

export const STATE_ENUM = {
  UNCHECKED: false,
  CHECKED: true,
  MEDIUM: 2
};

export function ButtonToggle(props) {
  const {
    className,
    onChange,
    label,
    innerLabelChecked,
    innerLabelUnchecked,
    checked
  } = props;

  const handleChange = e => {
    onChange(e.target.checked);
  };

  const checkedVal = checked === STATE_ENUM.MEDIUM ? false : checked;
  const classes = cn(
    "button-toggle",
    checkedVal ? "button-toggle--checked" : "button-toggle--unchecked",
    { "button-toggle--medium": checked === STATE_ENUM.MEDIUM },
    className
  );

  return (
    <label className={classes}>
      <input
        className="button-toggle__input"
        type="checkbox"
        checked={checkedVal}
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
  className: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  innerLabelChecked: PropTypes.string,
  innerLabelUnchecked: PropTypes.string,
  disabled: PropTypes.bool,
  checked: PropTypes.oneOf([
    STATE_ENUM.UNCHECKED,
    STATE_ENUM.CHECKED,
    STATE_ENUM.MEDIUM
  ])
};
ButtonToggle.defaultProps = {
  onChange: () => {},
  label: "",
  innerLabelChecked: "On",
  innerLabelUnchecked: "Off",
  disabled: false,
  checked: STATE_ENUM.UNCHECKED
};
ButtonToggle.STATE_ENUM = STATE_ENUM;

export default ButtonToggle;
