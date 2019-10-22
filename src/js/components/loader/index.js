import PropTypes from "prop-types";
import React from "react";

import "./loader.scss";

const Loader = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }
  return (
    <div className="loader">
      <div className="loader__image" />
    </div>
  );
};

Loader.propTypes = {
  isVisible: PropTypes.bool
};
Loader.defaultProps = {
  isVisible: false
};

export default React.memo(Loader);
