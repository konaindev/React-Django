import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import { Sort } from "../../icons";
import Select from "../select";

import "./sort_select.scss";

const SortSelect = ({ className, isReverse, onReverse, ...otherProps }) => {
  const classes = cn("sort-select", className);
  const iconClasses = cn("sort-select__icon", {
    "sort-select__icon--reverse": isReverse
  });
  return (
    <div className={classes}>
      <div className="sort-select__title">SORT:</div>
      <div className="sort-select__field-wrapper">
        <Select className="sort-select__field" {...otherProps} />
        <Sort className={iconClasses} onClick={() => onReverse(!isReverse)} />
      </div>
    </div>
  );
};

SortSelect.propTypes = {
  className: PropTypes.string,
  isReverse: PropTypes.bool,
  onChange: PropTypes.func,
  onReverse: PropTypes.func
};

SortSelect.defaultProps = {
  isReverse: false,
  onReverse: () => {}
};

export default React.memo(SortSelect);
