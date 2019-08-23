import cn from "classnames";
import { Formik, Form } from "formik";
import PropTypes from "prop-types";
import React from "react";

import { Checked } from "../../icons";
import Yup from "../../yup";
import Button from "../button";
import Input from "../input";
import PasswordOverlay from "../password_tooltip";
import Tooltip from "../rmb_tooltip";
import { props } from "./props";

const schema = Yup.object().shape({
  email: Yup.string()
    .required()
    .max(255)
    .email(),
  password: Yup.string(),
  confirm_password: Yup.string().when("password", (password, schema) => {
    if (password) {
      return Yup.string()
        .required()
        .oneOf([Yup.ref("password"), null]);
    }
    return schema;
  })
});

const initialValues = {
  email: "",
  old_password: "*******************",
  password: "",
  confirm_password: ""
};

export default class AccountSecurity extends React.PureComponent {
  static propTypes = {
    validate: PropTypes.func
  };

  static defaultProps = {
    validate: () => {}
  };

  state = { success: false };

  getErrorMessage = (errors, touched) => {
    let message;
    if (errors.confirm_password && touched.confirm_password) {
      message = "New passwords don’t match.";
    } else {
      for (let k of Object.keys(errors)) {
        if (touched[k]) {
          message = "Please review highlighted fields above.";
          break;
        }
      }
    }
    if (!message) {
      return;
    }
    return <div className="account-settings__general-error">{message}</div>;
  };

  getSuccessMessage = () => {
    if (!this.state.success) {
      return;
    }
    return (
      <div className="account-settings__success">
        <Checked className="account-settings__checked" />
        Password has successfuly been reset.
      </div>
    );
  };

  getFieldClasses = (name, errors, touched, extraModifiers = []) => {
    const extra = extraModifiers
      .map(mod => `account-settings__field--${mod}`)
      .join(" ");
    return cn("account-settings__field", extra, {
      "account-settings__field--error": errors[name] && touched[name]
    });
  };

  onSubmit = (values, actions) => {
    actions.setSubmitting(false);
    this.setState({ success: true });
    setTimeout(() => {
      this.setState({ success: false });
    }, 5000);
  };

  render() {
    return (
      <div className="account-settings__tab">
        <Formik
          validate={this.props.validate}
          validationSchema={schema}
          validateOnBlur={true}
          validateOnChange={true}
          initialValues={initialValues}
          onSubmit={this.onSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form method="post" autoComplete="off">
              <div className="account-settings__tab-content">
                <div className="account-settings__tab-title">
                  Account Security
                </div>
                <div className={this.getFieldClasses("email", errors, touched)}>
                  <div className="account-settings__label">Email Address</div>
                  <Input
                    className="account-settings__input"
                    name="email"
                    theme="gray"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="account-settings__field-group">
                  <div
                    className={this.getFieldClasses(
                      "old_password",
                      errors,
                      touched,
                      ["short"]
                    )}
                  >
                    <div className="account-settings__label">
                      Current Password
                    </div>
                    <Input
                      className="account-settings__input account-settings__input--current-password"
                      name="old_password"
                      type="password"
                      theme="gray"
                      value={values.old_password}
                    />
                  </div>
                  <div
                    className={this.getFieldClasses(
                      "password",
                      errors,
                      touched,
                      ["short"]
                    )}
                  >
                    <div className="account-settings__label">New Password</div>
                    <Tooltip
                      visible={true}
                      placement="bottom"
                      theme="dark"
                      overlay={
                        <PasswordOverlay
                          password={values.password}
                          errors={errors.password}
                          {...props}
                        />
                      }
                      trigger={["focus"]}
                    >
                      <Input
                        className="account-settings__input"
                        name="password"
                        type="password"
                        theme="gray"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Tooltip>
                  </div>
                  <div
                    className={this.getFieldClasses(
                      "confirm_password",
                      errors,
                      touched,
                      ["short"]
                    )}
                  >
                    <div className="account-settings__label">
                      Confirm Password
                    </div>
                    <Input
                      className="account-settings__input"
                      name="confirm_password"
                      type="password"
                      theme="gray"
                      value={values.confirm_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              </div>
              <div className="account-settings__buttons-field">
                <Button
                  className="account-settings__button"
                  color="primary"
                  type="submit"
                >
                  Save
                </Button>
                {this.getErrorMessage(errors, touched)}
                {this.getSuccessMessage()}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
