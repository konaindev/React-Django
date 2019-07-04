import PropTypes from "prop-types";
import React from "react";

import Select from "../select";
import { LogOut } from "../../icons";

import "./user_menu.scss";

export default class UserMenu extends React.PureComponent {
  static propTypes = {
    profile_image_url: PropTypes.string,
    logout_url: PropTypes.string.isRequired
  };

  static defaultProps = {
    profile_image_url: ""
  };

  userImage = () => {
    const { profile_image_url } = this.props;
    const style = {
      backgroundImage: `url(${profile_image_url})`
    };
    return (
      <div className="user-menu__image-container">
        <div className="user-menu__image-default" />
        <div className="user-menu__image" style={style} />
      </div>
    );
  };

  logOut = () => {
    return (
      <div className="user-menu__dropdown">
        <div className="user-menu__dropdown-item" onClick={this.onLogOut}>
          <LogOut className="user-menu__icon" />
          <div>Log Out</div>
        </div>
      </div>
    );
  };

  onLogOut = () => {
    const { logout_url } = this.props;
    window.location.href = logout_url;
  };

  render() {
    const { profile_image_url } = this.props;
    const style = {
      backgroundImage: `url(${profile_image_url})`
    };
    return (
      <div className="user-menu">
        <Select
          className="user-menu__select"
          components={{
            Menu: this.logOut,
            Placeholder: this.userImage
          }}
          profile_image_url={profile_image_url}
        />
      </div>
    );
  }
}
