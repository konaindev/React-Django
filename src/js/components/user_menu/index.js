import PropTypes from "prop-types";
import React from "react";
import { components } from "react-select";

import Select from "../select";
import { LogOut } from "../../icons";
import { Settings } from "../../icons";

import "./user_menu.scss";

export default class UserMenu extends React.PureComponent {
  static propTypes = {
    profile_image_url: PropTypes.string,
    logout_url: PropTypes.string.isRequired,
    account_settings_url: PropTypes.string
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
        <div className="user-menu__image user-menu__image--default" />
        <div className="user-menu__image" style={style} />
      </div>
    );
  };

  dropdownMenu = props => {
    let settingsItem;
    if (this.props.account_settings_url) {
      settingsItem = (
        <a
          className="user-menu__dropdown-item"
          href={this.props.account_settings_url}
        >
          <Settings className="user-menu__icon" />
          <div>Account Settings</div>
        </a>
      );
    }
    return (
      <components.Menu {...props} className="user-menu__dropdown">
        {settingsItem}
        <a className="user-menu__dropdown-item" href={this.props.logout_url}>
          <LogOut className="user-menu__icon" />
          <div>Log Out</div>
        </a>
      </components.Menu>
    );
  };

  render() {
    const { profile_image_url, ...otherProps } = this.props;
    const style = {
      backgroundImage: `url(${profile_image_url})`
    };
    return (
      <div className="user-menu">
        <Select
          className="user-menu__select"
          components={{
            Menu: this.dropdownMenu,
            Placeholder: this.userImage
          }}
          profile_image_url={profile_image_url}
          {...otherProps}
        />
      </div>
    );
  }
}
