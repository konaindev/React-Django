import PropTypes from "prop-types";
import React from "react";

import Close from "../../icons/close";
import Panel from "../panel";

const Tag = ({ name, isAdmin }) => (
  <Panel className="property-overview__tag">
    <div className="property-overview__tag-name">{name}</div>
    {isAdmin ? (
      <div className="property-overview__tag-close">
        <Close className="property-overview__tag-close-icon" />
      </div>
    ) : null}
  </Panel>
);
Tag.propTypes = {
  name: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool
};
Tag.defaultProps = {
  isAdmin: false
};

export default React.memo(Tag);
