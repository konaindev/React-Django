import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Formik, Form } from "formik";

import Button from "../button";
import Input from "../input";
import FormFiled from "../form_field";
import PageAuth from "../page_auth";
import RMBTooltip from "../rmb_tooltip";
import WizardProgress from "../wizard_progress";
import { Error, Ok } from "../../icons";

import "./create_password_view.scss";

export default class CreatePasswordView extends React.PureComponent {
  static propTypes = {
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired
      })
    ).isRequired,
    validate: PropTypes.func,
    onSubmit: PropTypes.func
  };

  static defaultProps = {
    validate: () => {},
    onSubmit: () => {}
  };

  steps = [
    { name: "Set Password", isActive: true },
    { name: "Complete Account" }
  ];

  validate = values => {
    return this.props.validate(values.password).then(fieldError => {
      let errors = {};
      if (Object.keys(fieldError).length) {
        errors.password = fieldError;
      }
      if (!values.password2 || values.password2 !== values.password) {
        errors.password2 = "Passwords must match";
      }
      if (Object.keys(errors).length) {
        throw errors;
      }
    });
  };

  renderTooltip = (value, errors) => {
    const rules = this.props.rules.map(rule => {
      const error = errors?.[rule.key];
      const classes = cn("create-password-tooltip__rule", {
        "create-password-tooltip__rule--error": value && error,
        "create-password-tooltip__rule--ok": value && !error
      });
      return (
        <div className={classes} key={rule.key}>
          <div className="create-password-tooltip__icon create-password-tooltip__icon--default" />
          <Error className="create-password-tooltip__icon create-password-tooltip__icon--error" />
          <Ok className="create-password-tooltip__icon create-password-tooltip__icon--ok" />
          <div className="create-password-tooltip__text">{rule.label}</div>
        </div>
      );
    });
    return (
      <div className="create-password-tooltip">
        <div className="create-password-tooltip__title">Password must:</div>
        <div className="create-password-tooltip__rules">{rules}</div>
      </div>
    );
  };

  getButtonColor = isValid => {
    if (isValid) {
      return "primary";
    }
    return "disabled-light";
  };

  render() {
    return (
      <PageAuth backLink="/">
        <div className="create-password">
          <WizardProgress
            className="create-password__wizard"
            steps={this.steps}
          />
          <div className="create-password__body">
            <div className="create-password__title">Set your password</div>
            <div className="create-password__subtitle">
              Enter a password to gain access to your account.
            </div>
            <Formik validate={this.validate} onSubmit={this.props.onSubmit}>
              {({
                errors,
                touched,
                values,
                isValid,
                handleChange,
                handleBlur
              }) => (
                <Form className="create-password__form">
                  <div className="create-password__field">
                    <FormFiled label="Password">
                      <RMBTooltip
                        theme="light"
                        trigger={["focus"]}
                        visible={true}
                        overlay={this.renderTooltip(
                          values.password,
                          errors.password
                        )}
                      >
                        <Input
                          type="password"
                          name="password"
                          theme="highlight"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                        />
                      </RMBTooltip>
                    </FormFiled>
                  </div>
                  <div className="create-password__field">
                    <FormFiled
                      label="Confirm Password"
                      error={errors.password2}
                      touched={touched.password2}
                    >
                      <Input
                        type="password"
                        name="password2"
                        theme="highlight"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password2}
                      />
                    </FormFiled>
                  </div>
                  <Button
                    className="create-password__button"
                    color={this.getButtonColor(isValid)}
                    fullWidth={true}
                    uppercase={true}
                    type="submit"
                  >
                    Set Password
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </PageAuth>
    );
  }
}
