import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Close from "../../icons/close";
import Panel from "../panel";

const Tag = ({ name, isAdmin, onRemove }) => {
  const classes = cn("property-overview__tag", {
    "property-overview__tag--admin": isAdmin
  });
  return (
    <Panel className={classes}>
      <div className="property-overview__tag-name">{name}</div>
      {isAdmin ? (
        <div
          className="property-overview__tag-remove"
          onClick={() => onRemove(name)}
        >
          <Close className="property-overview__tag-remove-icon" />
        </div>
      ) : null}
    </Panel>
  );
};
Tag.propTypes = {
  name: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  isAdmin: PropTypes.bool
};
Tag.defaultProps = {
  isAdmin: false,
  onRemove() {}
};

export default React.memo(Tag);
