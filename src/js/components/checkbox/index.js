import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./checkbox.scss";

const Checkbox = ({ isSelected, className, ...otherProps }) => {
  const classes = cn("checkbox", className, {
    "checkbox--selected": isSelected
  });
  return <div className={classes} {...otherProps} />;
};

Checkbox.propTypes = {
  isSelected: PropTypes.bool
};

Checkbox.defaultProps = {
  isSelected: false
};

export default React.memo(Checkbox);
