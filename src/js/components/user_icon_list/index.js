import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import UserIcon from "../user_icon";
import RMBTooltip from "../rmb_tooltip";

import "./user_icon_list.scss";

function getColor(i) {
  const colors = ["#006EFF", "#6B29BE"];
  return colors[i % 2];
}

export default class UserIconList extends React.PureComponent {
  static propTypes = {
    users: PropTypes.arrayOf(
      PropTypes.shape({
        user_id: PropTypes.string.isRequired,
        profile_image_url: PropTypes.string,
        account_name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        is_current: PropTypes.bool
      })
    ),
    maxCount: PropTypes.number,
    className: PropTypes.string,
    theme: PropTypes.oneOf(["project"]),
    tooltipPlacement: PropTypes.oneOf(["bottom", "top"]),
    tooltipTheme: PropTypes.oneOf(["", "highlight", "dark", "light-dark"])
  };

  static defaultProps = {
    users: [],
    maxCount: 5,
    tooltipPlacement: "top",
    tooltipTheme: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      zIndexes: [...Array(props.maxCount).keys()].reverse()
    };
  }

  onMouseEnterHandler = e => {
    if (e.currentTarget.dataset.index) {
      const index = parseInt(e.currentTarget.dataset.index);
      this.setState(state => {
        const zIndexes = [...state.zIndexes];
        zIndexes[index] += 1;
        return { zIndexes };
      });
    }
  };

  onMouseLeaveHandler = e => {
    if (e.currentTarget.dataset.index) {
      const index = parseInt(e.currentTarget.dataset.index);
      this.setState(state => {
        const zIndexes = [...state.zIndexes];
        zIndexes[index] -= 1;
        return { zIndexes };
      });
    }
  };

  renderOverlay = user => (
    <div>
      <div className="user-icon-list__name">
        {user.account_name}
        {!!user.is_current ? (
          <span className="user-icon-list__name-sign"> (You)</span>
        ) : null}
      </div>
      <div className="user-icon-list__role">{user.role}</div>
    </div>
  );

  renderIcons = () => {
    const { users, maxCount } = this.props;
    return users.slice(0, maxCount).map((user, i) => {
      const classes = cn("user-icon-list__icon", {
        "user-icon-list__icon--current": !!user.is_current
      });
      return (
        <RMBTooltip
          overlayClassName="user-icon-list__tooltip"
          placement={this.props.tooltipPlacement}
          theme={this.props.tooltipTheme}
          overlay={this.renderOverlay(user)}
          key={user.user_id}
        >
          <UserIcon
            className={classes}
            account_name={user.account_name}
            profile_image_url={user.profile_image_url}
            color={getColor(i)}
            data-index={i}
            style={{ zIndex: this.state.zIndexes[i] }}
            onMouseEnter={this.onMouseEnterHandler}
            onMouseLeave={this.onMouseLeaveHandler}
          />
        </RMBTooltip>
      );
    });
  };

  renderCount = () => {
    const { users, maxCount, theme } = this.props;
    let count = (
      <div className="user-icon-list__count">
        <span>+{users.slice(maxCount).length}</span>
      </div>
    );

    if (theme === "project") {
      const overlay = (
        <div className="user-icon-list__name">View All Users</div>
      );
      count = (
        <RMBTooltip
          overlayClassName="user-icon-list__tooltip"
          placement={this.props.tooltipPlacement}
          theme={this.props.tooltipTheme}
          overlay={overlay}
        >
          {count}
        </RMBTooltip>
      );
    }

    return count;
  };

  render() {
    const {
      className,
      users,
      maxCount,
      theme,
      tooltipPlacement,
      tooltipTheme,
      ...otherProps
    } = this.props;
    let count = null;
    if (users.length > maxCount) {
      count = this.renderCount();
    }
    const classes = cn(
      "user-icon-list",
      { [`user-icon-list--${theme}`]: theme },
      className
    );
    return (
      <div className={classes} {...otherProps}>
        {this.renderIcons()}
        {count}
      </div>
    );
  }
}
