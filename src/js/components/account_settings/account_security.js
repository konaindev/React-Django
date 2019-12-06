import cn from "classnames";
import { ErrorMessage, Formik, Form } from "formik";
import PropTypes from "prop-types";
import React from "react";

import { validatePassword } from "../../api/password";
import { Tick } from "../../icons";
import Button from "../button";
import Input from "../input";
import PasswordOverlay from "../password_tooltip";
import Tooltip from "../rmb_tooltip";
import { securitySchema } from "./validators";

const TYPING_TIMEOUT = 300;

export default class AccountSecurity extends React.PureComponent {
  static propTypes = {
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.string
      })
    ).isRequired,
    user: PropTypes.object,
    validate: PropTypes.func
  };

  static defaultProps = {
    validate: (values, userId) => {
      clearTimeout(this.validateTimeoutId);
      if (!values.password) {
        return;
      }
      return new Promise(resolve => {
        this.validateTimeoutId = setTimeout(() => resolve(), TYPING_TIMEOUT);
      })
        .then(() => validatePassword(values.password, userId))
        .then(errors => {
          if (Object.keys(errors).length) {
            throw {
              password: errors
            };
          }
        });
    },
    user: {}
  };

  state = { message: null };

  constructor(props) {
    super(props);
    this.initialValues = {
      email: props.user.email,
      old_password: "",
      password: "",
      confirm_password: ""
    };
  }

  unsetMessage() {
    if (this.state.message) {
      this.setState({ message: null });
    }
  }

  setFormik = formik => {
    this.formik = formik;
  };

  showErrorMessage = (errors, touched) => {
    let message;
    if (errors.__all__) {
      message = errors.__all__;
    } else if (errors.confirm_password && touched.confirm_password) {
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

  showMessage = (errors, touched) => {
    if (this.state.message) {
      return this.showSuccessMessage();
    } else if (errors) {
      return this.showErrorMessage(errors, touched);
    }
  };

  showSuccessMessage = () => {
    return (
      <div className="account-settings__success">
        <Tick className="account-settings__checked" />
        {this.state.message}
      </div>
    );
  };

  setSuccessMessage = message => {
    this.formik.setSubmitting(false);
    const { values } = this.formik.state;
    if (values.password) {
      values.old_password = "";
      values.password = "";
      values.confirm_password = "";
    }
    this.formik.setValues(values);
    this.setState({ message });
  };

  setErrorMessages = errors => {
    this.formik.setSubmitting(false);
    const formikErrors = {};
    for (let k of Object.keys(errors)) {
      formikErrors[k] = errors[k][0].message;
    }
    this.formik.setErrors(formikErrors);
  };

  getFieldClasses = (name, errors, touched) => {
    return cn("account-settings__field", {
      "account-settings__field--error": errors[name] && touched[name]
    });
  };

  onSubmit = data => {
    this.unsetMessage();
    this.props.dispatch({
      type: "API_SECURITY_ACCOUNT",
      callback: this.setSuccessMessage,
      onError: this.setErrorMessages,
      data
    });
  };

  onChange = v => {
    this.unsetMessage();
    this.formik.handleChange(v);
  };

  onBlur = v => {
    this.unsetMessage();
    this.formik.handleBlur(v);
  };

  render() {
    return (
      <div className="account-settings__tab">
        <Formik
          ref={this.setFormik}
          validate={values =>
            this.props.validate(values, this.props.user.user_id)
          }
          validationSchema={securitySchema}
          validateOnBlur={true}
          validateOnChange={true}
          initialValues={this.initialValues}
          onSubmit={this.onSubmit}
        >
          {({ errors, touched, values }) => (
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
                      onChange={this.onChange}
                      onBlur={this.onBlur}
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
                        onChange={this.onChange}
                        onBlur={this.onBlur}
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
                          onChange={this.onChange}
                          onBlur={this.onBlur}
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
                        onChange={this.onChange}
                        onBlur={this.onBlur}
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
                {this.showMessage(errors, touched)}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
