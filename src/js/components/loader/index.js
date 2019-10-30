import PropTypes from "prop-types";
import React from "react";

import "./loader.scss";

const Loader = ({ isShow }) => {
  if (!isShow) {
    return null;
  }
  return (
    <div className="loader">
      <div className="loader__image" />
    </div>
  );
};

Loader.propTypes = {
  isShow: PropTypes.bool
};
Loader.defaultProps = {
  isShow: false
};

export default React.memo(Loader);
