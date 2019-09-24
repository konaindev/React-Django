import PropTypes from "prop-types";
import React from "react";
import { components } from "react-select";
import { auth } from "../../state/actions";
import Select from "../select";
import { LogOut } from "../../icons";
import { connect } from "react-redux";
import "./user_menu.scss";
import { Link } from "react-router-dom";

export class UserMenu extends React.PureComponent {
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
        <div className="user-menu__image user-menu__image--default" />
        <div className="user-menu__image" style={style} />
      </div>
    );
  };

  doLogout = () => {
    this.props.dispatch(auth.logout());
  };

  dropdownMenu = props => {
    return (
      <components.Menu {...props} className="user-menu__dropdown">
        <Link
          style={{ color: "inherit", textDecoration: "inherit" }}
          className="user-menu__dropdown-item"
          to="#"
          onClick={this.doLogout}
        >
          <LogOut className="user-menu__icon" />
          <div>Log Out</div>
        </Link>
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

export default connect()(UserMenu);
