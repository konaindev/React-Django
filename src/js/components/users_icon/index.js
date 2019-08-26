import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./users_icon.scss";

function getColor(i) {
  const colors = ["#006EFF", "#6B29BE"];
  return colors[i % 2];
}

const UsersIcon = ({ className, users, maxCount, ...otherProps }) => {
  const icons = users
    .slice(0, maxCount)
    .reverse()
    .map((user, i) => {
      let imgStyle = { backgroundImage: `url(${user.profile_image_url})` };
      const style = { backgroundColor: getColor(i) };
      const initials = user.account_name
        .split(" ")
        .map(s => s[0])
        .join("");
      return (
        <div className="users-icon__icon" key={user.user_id} style={style}>
          {initials}
          <div className="users-icon__img" style={imgStyle} />
        </div>
      );
    });
  let count = null;
  if (users.length > maxCount) {
    count = (
      <div className="users-icon__count">
        <span>+{users.slice(maxCount).length}</span>
      </div>
    );
  }
  const classes = cn("users-icon", className);
  return (
    <div className={classes} {...otherProps}>
      {count}
      {icons}
    </div>
  );
};
UsersIcon.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.string.isRequired,
      profile_image_url: PropTypes.string,
      account_name: PropTypes.string
    })
  ),
  maxCount: PropTypes.number
};
UsersIcon.defaultProps = {
  users: [],
  maxCount: 5
};

export default React.memo(UsersIcon);
