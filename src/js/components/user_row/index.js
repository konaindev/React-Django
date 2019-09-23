import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import UserIcon from "../user_icon";

import "./user_row.scss";

const UserRow = ({
  className,
  account_name,
  email,
  profile_image_url,
  ...otherProps
}) => {
  const classes = cn("user-row", className);
  return (
    <div className={classes} {...otherProps}>
      <UserIcon
        className="user-row__avatar"
        profile_image_url={profile_image_url}
        account_name={account_name}
      />
      <div>
        <div className="user-row__name">{account_name}</div>
        <div className="user-row__email">{email}</div>
      </div>
    </div>
  );
};
UserRow.propTypes = {
  className: PropTypes.string,
  email: PropTypes.string.isRequired,
  profile_image_url: PropTypes.string,
  account_name: PropTypes.string.isRequired
};
UserRow.defaultProps = {
  className: ""
};

export default React.memo(UserRow);
