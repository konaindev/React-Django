import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Formik, Form } from "formik";

import AccountForm from "../account_form";
import Button from "../button";
import Input from "../input";
import FormFiled from "../form_field";
import PageAuth from "../page_auth";
import RMBTooltip from "../rmb_tooltip";
import WizardProgress from "../wizard_progress";
import { Error, Ok } from "../../icons";
import router from "../../router";

import "./create_password_view.scss";

class CreatePasswordView extends React.PureComponent {
  static propTypes = {
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired
      })
    ).isRequired,
    validate: PropTypes.func
  };

  static defaultProps = {
    validate: () => {}
  };

  constructor(props) {
    super(props);
    this._router = router("/create-password/*")(hash =>
      props.dispatch({
        type: "API_CREATE_PASSWORD",
        hash
      })
    );
  }

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

  onSubmit = (values, actions) => {
    this.props.dispatch({
      type: "API_CREATE_PASSWORD",
      hash: this.props.hash,
      data: {
        password: values.password
      }
    });
  };

  render() {
    return (
      <PageAuth backLink="/">
        <AccountForm
          steps={this.steps}
          title="Set your password"
          subtitle="Enter a password to gain access to your account."
        >
          <Formik validate={this.validate} onSubmit={this.onSubmit}>
            {({
              errors,
              touched,
              values,
              isValid,
              handleChange,
              handleBlur
            }) => (
              <Form>
                <div className={AccountForm.fieldClass}>
                  <FormFiled label="Password">
                    <RMBTooltip
                      theme="highlight"
                      trigger={["focus"]}
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
                <div className={AccountForm.fieldClass}>
                  <FormFiled
                    label="Confirm Password"
                    error={errors.password2}
                    showError={touched.password2 && values.password}
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
        </AccountForm>
      </PageAuth>
    );
  }
}

const mapState = state => ({
  ...state.createPassword
});

export default connect(mapState)(CreatePasswordView);
