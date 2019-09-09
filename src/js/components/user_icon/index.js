import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./user_icon.scss";

const UserIcon = ({
  className,
  color,
  account_name,
  profile_image_url,
  style,
  ...otherProps
}) => {
  const classes = cn("user-icon", className);
  const initials = account_name
    .split(" ")
    .map(s => s[0])
    .join("");
  const imgStyle = { backgroundImage: `url(${profile_image_url})` };
  const containerStyle = { backgroundColor: color, ...style };
  return (
    <div className={classes} style={containerStyle} {...otherProps}>
      {initials}
      <div className="user-icon__avatar" style={imgStyle} />
    </div>
  );
};
UserIcon.propTypes = {
  profile_image_url: PropTypes.string,
  account_name: PropTypes.string,
  color: PropTypes.string
};
UserIcon.defaultProps = {
  profile_image_url: "",
  account_name: ""
};

export default React.memo(UserIcon);
