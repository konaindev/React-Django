import _get from "lodash/get";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import defaultStrings from "./default_strings";

const UIStrings = ({ path, strings, language }) => {
  const localizationPath = `${language}.${path}`;
  let text = _get(strings, localizationPath);
  if (text === undefined) {
    text = _get(defaultStrings, localizationPath);
  }
  if (text === undefined) {
    throw new Error(`String ${localizationPath} not found`);
  }
  return text;
};

UIStrings.propTypes = {
  path: PropTypes.string.isRequired,
  strings: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired
};

const mapState = state => ({
  strings: state.uiStrings.strings,
  language: state.uiStrings.language
});

export default connect(mapState)(UIStrings);
