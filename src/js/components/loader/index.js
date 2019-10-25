import PropTypes from "prop-types";
import React from "react";

import "./loader.scss";

const Loader = ({ isShow }) => {
  if (!isShow) {
    console.log("IN LOADER not show");
    return null;
  }
  console.log("LOADER IS SHOW");
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
