import cn from "classnames";
import React from "react";

import { Email, Lock, Profile } from "../../icons";
import PageChrome from "../page_chrome";

import "./account_settings.scss";

export default class AccountSettings extends React.PureComponent {
  state = { tab: "profile" };

  menuItems = [
    {
      id: "profile",
      name: "Profile",
      component: Profile
    },
    {
      id: "lock",
      name: "Security",
      component: Lock
    },
    {
      id: "email",
      name: "Email Reports",
      component: Email
    }
  ];

  selectTab = tab => this.setState({ tab });

  getItems = () => {
    const { tab } = this.state;
    return this.menuItems.map(item => {
      const Component = item.component;
      const itemClass = cn("account-settings__menu-item", {
        "account-settings__menu-item--active": item.id === tab
      });
      return (
        <div
          className={itemClass}
          key={item.id}
          onClick={() => this.selectTab(item.id)}
        >
          <Component />
          <span className="account-settings__menu-item-text">{item.name}</span>
        </div>
      );
    });
  };

  render() {
    return (
      <PageChrome>
        <div className="account-settings">
          <div className="account-settings__header">
            <div className="account-settings__title">Account Settings</div>
            <div className="account-settings__subtitle">
              Manage and edit your profile, security, notifications, and billing
              settings.
            </div>
          </div>
          <div className="account-settings__panel">
            <div className="account-settings__menu">{this.getItems()}</div>
            <div className="account-settings__page-content"></div>
          </div>
        </div>
      </PageChrome>
    );
  }
}
