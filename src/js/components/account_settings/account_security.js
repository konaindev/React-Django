import { Formik, Form } from "formik";
import React from "react";

import Yup from "../../yup";
import Button from "../button";
import PasswordOverlay from "../password_tooltip";
import Tooltip from "../rmb_tooltip";
import { props } from "./props";

const schema = Yup.object().shape({
  email: Yup.string()
    .required()
    .max(255)
    .email(),
  password: Yup.string()
    .required()
    .min(8)
});

export default class AccountSecurity extends React.Component {
  state = { password: "" };

  changePassword = e => {
    this.setState({ password: e.target.value });
  };

  render() {
    return (
      <div className="account-settings__tab">
        <Formik validationSchema={schema} validateOnBlur={true}>
          {({ errors, touched, values, isValid, setTouched, setValues }) => (
            <Form method="post" autoComplete="off">
              <div className="account-settings__tab-content">
                <div className="account-settings__tab-title">
                  Account Security
                </div>
                <div className="account-settings__field">
                  <div className="account-settings__label">Email Address</div>
                  <input className="account-settings__input" name="email" />
                </div>
                <div className="account-settings__field-group">
                  <div className="account-settings__field account-settings__field--short">
                    <div className="account-settings__label">
                      Current Password
                    </div>
                    <input
                      className="account-settings__input account-settings__input--current-password"
                      name="old_password"
                      type="password"
                    />
                  </div>
                  <div className="account-settings__field account-settings__field--short">
                    <div className="account-settings__label">New Password</div>
                    <Tooltip
                      placement="bottom"
                      theme="dark"
                      overlay={
                        <PasswordOverlay
                          password={this.state.password}
                          {...props}
                        />
                      }
                      trigger={["focus"]}
                    >
                      <input
                        className="account-settings__input"
                        name="password"
                        value={this.state.password}
                        type="password"
                        onChange={this.changePassword}
                      />
                    </Tooltip>
                  </div>
                  <div className="account-settings__field account-settings__field--short">
                    <div className="account-settings__label">
                      Confirm Password
                    </div>
                    <input
                      className="account-settings__input"
                      name="confirm_password"
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
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
