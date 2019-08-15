import React from "react";

import Button from "../button";

export default class AccountSecurity extends React.Component {
  render() {
    return (
      <div className="account-settings__tab">
        <div className="account-settings__tab-content">
          <div className="account-settings__tab-title">Account Security</div>
          <div className="account-settings__field">
            <div className="account-settings__label">Email Address</div>
            <input className="account-settings__input" />
          </div>
          <div className="account-settings__field-group">
            <div className="account-settings__field account-settings__field--short">
              <div className="account-settings__label">Current Password</div>
              <input className="account-settings__input" type="password" />
            </div>
            <div className="account-settings__field account-settings__field--short">
              <div className="account-settings__label">New Password</div>
              <input className="account-settings__input" type="password" />
            </div>
            <div className="account-settings__field account-settings__field--short">
              <div className="account-settings__label">Confirm Password</div>
              <input className="account-settings__input" type="password" />
            </div>
          </div>
        </div>
        <div className="account-settings__buttons-field">
          <Button className="account-settings__button" color="primary">
            Save
          </Button>
        </div>
      </div>
    );
  }
}
