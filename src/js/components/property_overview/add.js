import PropTypes from "prop-types";
import React from "react";

import { AddWhite } from "../../icons";

export const AddButton = ({ onClick }) => {
  return (
    <div className="property-overview__add-tag" onClick={onClick}>
      <AddWhite />
      <div className="property-overview__add-tag-text">Add Tag</div>
    </div>
  );
};
AddButton.propTypes = { onClick: PropTypes.func };
AddButton.defaultProps = { onClick() {} };
