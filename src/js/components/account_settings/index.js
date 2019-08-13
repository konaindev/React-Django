import cn from "classnames";
import React from "react";

import { Email, Lock, Profile } from "../../icons";
import PageChrome from "../page_chrome";

import Button from "../button";
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
            <div className="account-settings__tab">
              <div className="account-settings__tab-content">
                <div className="account-settings__tab-title">
                  Account Security
                </div>
                <div className="account-settings__field">
                  <div className="account-settings__label">Email Address</div>
                  <input className="account-settings__input" />
                </div>
                <div className="account-settings__field-group">
                  <div className="account-settings__field account-settings__field--short">
                    <div className="account-settings__label">
                      Current Password
                    </div>
                    <input
                      className="account-settings__input"
                      type="password"
                    />
                  </div>
                  <div className="account-settings__field account-settings__field--short">
                    <div className="account-settings__label">New Password</div>
                    <input
                      className="account-settings__input"
                      type="password"
                    />
                  </div>
                  <div className="account-settings__field account-settings__field--short">
                    <div className="account-settings__label">
                      Confirm Password
                    </div>
                    <input
                      className="account-settings__input"
                      type="password"
                    />
                  </div>
                </div>
              </div>
              <div className="account-settings__buttons-field">
                <Button className="account-settings__button" color="primary">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageChrome>
    );
  }
}
