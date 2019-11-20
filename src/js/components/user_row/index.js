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
  is_current,
  business_name,
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
        <div className="user-row__name">
          {account_name}
          {is_current ? (
            <span className="user-row__name-sign"> (You)</span>
          ) : null}
        </div>
        <div className="user-row__email">{business_name || email}</div>
      </div>
    </div>
  );
};
UserRow.propTypes = {
  className: PropTypes.string,
  email: PropTypes.string.isRequired,
  profile_image_url: PropTypes.string,
  account_name: PropTypes.string.isRequired,
  is_current: PropTypes.bool
};
UserRow.defaultProps = {
  className: "",
  is_current: false
};

export default React.memo(UserRow);
