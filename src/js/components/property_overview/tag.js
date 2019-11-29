import PropTypes from "prop-types";
import React from "react";

import Panel from "../panel";

const Tag = ({ name }) => (
  <Panel className="property-overview__tag">
    <div className="property-overview__tag-name">{name}</div>
  </Panel>
);
Tag.propTypes = {
  name: PropTypes.string.isRequired
};

export default React.memo(Tag);
