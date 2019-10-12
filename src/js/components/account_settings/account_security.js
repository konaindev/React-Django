import cn from "classnames";
import { ErrorMessage, Formik, Form } from "formik";
import _pickBy from "lodash/pickBy";
import PropTypes from "prop-types";
import React from "react";

import { Tick } from "../../icons";
import Button from "../button";
import Input from "../input";
import PasswordOverlay from "../password_tooltip";
import Tooltip from "../rmb_tooltip";
import { securitySchema } from "./validators";

const initialValues = {
  email: "",
  old_password: "",
  password: "",
  confirm_password: ""
};

export default class AccountSecurity extends React.PureComponent {
  static propTypes = {
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.string
      })
    ).isRequired,
    validate: PropTypes.func
  };

  static defaultProps = {
    validate: () => {}
  };

  state = { fieldsSubmitted: [] };

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
    const fields = this.state.fieldsSubmitted;
    if (!fields.length) {
      return;
    }
    let message;
    if (fields.includes("password")) {
      message = "Password has successfuly been reset.";
    } else if (fields.includes("email")) {
      message = "Email change successful.";
    }
    return (
      <div className="account-settings__success">
        <Tick className="account-settings__checked" />
        {message}
      </div>
    );
  };

  getFieldClasses = (name, errors, touched) => {
    return cn("account-settings__field", {
      "account-settings__field--error": errors[name] && touched[name]
    });
  };

  onSubmit = (values, actions) => {
    actions.setSubmitting(false);
    if (!values.email && !values.password) {
      return;
    }
    this.setState({ fieldsSubmitted: Object.keys(_pickBy(values)) });
    setTimeout(() => {
      this.setState({ fieldsSubmitted: [] });
    }, 5000);
  };

  render() {
    return (
      <div className="account-settings__tab">
        <Formik
          validate={this.props.validate}
          validationSchema={securitySchema}
          validateOnBlur={true}
          validateOnChange={true}
          initialValues={initialValues}
          onSubmit={this.onSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form method="post" autoComplete="off">
              <div className="account-settings__tab-content">
                <div className="account-settings__tab-section">
                  <div className="account-settings__tab-title">
                    Account Security
                  </div>
                  <div
                    className={this.getFieldClasses("email", errors, touched)}
                  >
                    <div className="account-settings__label">Email Address</div>
                    <Input
                      className="account-settings__input"
                      name="email"
                      theme="gray"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="account-settings__error">
                      <ErrorMessage name="email" />
                    </div>
                  </div>
                </div>
                <div className="account-settings__tab-section">
                  <div className="account-settings__field-grid account-settings__field-grid--col-3">
                    <div
                      className={this.getFieldClasses(
                        "old_password",
                        errors,
                        touched
                      )}
                    >
                      <div className="account-settings__label">
                        Current Password
                      </div>
                      <Input
                        className="account-settings__input"
                        name="old_password"
                        type="password"
                        theme="gray"
                        value={values.old_password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="old_password" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses(
                        "password",
                        errors,
                        touched
                      )}
                    >
                      <div className="account-settings__label">
                        New Password
                      </div>
                      <Tooltip
                        placement="bottom"
                        theme="dark"
                        overlay={
                          <PasswordOverlay
                            password={values.password}
                            errors={errors.password}
                            rules={this.props.rules}
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
                        touched
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
              </div>
              <div className="account-settings__controls">
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
