import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import UserIcon from "../user_icon";

import "./user_icon_list.scss";

function getColor(i) {
  const colors = ["#006EFF", "#6B29BE"];
  return colors[i % 2];
}

const UserIconList = ({ className, users, maxCount, ...otherProps }) => {
  const icons = users
    .slice(0, maxCount)
    .reverse()
    .map((user, i) => (
      <UserIcon
        className="user-icon-list__icon"
        key={user.user_id}
        {...user}
        color={getColor(i)}
      />
    ));
  let count = null;
  if (users.length > maxCount) {
    count = (
      <div className="user-icon-list__count">
        <span>+{users.slice(maxCount).length}</span>
      </div>
    );
  }
  const classes = cn("user-icon-list", className);
  return (
    <div className={classes} {...otherProps}>
      {count}
      {icons}
    </div>
  );
};
UserIconList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.string.isRequired,
      profile_image_url: PropTypes.string,
      account_name: PropTypes.string
    })
  ),
  maxCount: PropTypes.number
};
UserIconList.defaultProps = {
  users: [],
  maxCount: 5
};

export default React.memo(UserIconList);
