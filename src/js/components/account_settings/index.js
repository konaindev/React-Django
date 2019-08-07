import React from "react";
import PropTypes from "prop-types";

import { Email, Lock, Profile } from "../../icons";
import PageChrome from "../page_chrome";

import "./account_settings.scss";

export default class AccountSettings extends React.Component {
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
            <div className="account-settings__menu">
              <div className="account-settings__menu-item">
                <Profile />
                <span className="account-settings__menu-item-text">
                  Profile
                </span>
              </div>
              <div className="account-settings__menu-item">
                <Lock />
                <span className="account-settings__menu-item-text">
                  Security
                </span>
              </div>
              <div className="account-settings__menu-item">
                <Email />
                <span className="account-settings__menu-item-text">
                  Email Reports
                </span>
              </div>
            </div>
            <div className="account-settings__page-content"></div>
          </div>
        </div>
      </PageChrome>
    );
  }
}
