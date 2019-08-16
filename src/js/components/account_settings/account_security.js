import React from "react";

import Button from "../button";
import { PasswordOverlay } from "../password_tooltip";
import Tooltip from "../rmb_tooltip";

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
              <input
                className="account-settings__input account-settings__input--current-password"
                type="password"
              />
            </div>
            <div className="account-settings__field account-settings__field--short">
              <div className="account-settings__label">New Password</div>
              <Tooltip
                placement="bottom"
                theme="dark"
                overlay={<PasswordOverlay />}
                trigger={["focus"]}
              >
                <input className="account-settings__input" type="password" />
              </Tooltip>
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
