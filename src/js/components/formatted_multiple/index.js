import React, { Component } from "react";
import PropTypes from "prop-types";

import "./formatted_multiple.scss";

export const FormattedMultiple = ({ value }) => (
  <>
    {value}
    <span className="formatted-multiple">x</span>
  </>
);

export default FormattedMultiple;
