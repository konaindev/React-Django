import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Formik, Form } from "formik";

import AccountForm from "../account_form";
import router from "../../router";
import Button from "../button";
import Input from "../input";
import FormField from "../form_field";
import PageAuth from "../page_auth";
import PasswordOverlay from "../password_tooltip";
import RMBTooltip from "../rmb_tooltip";

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
                  <FormField label="Password">
                    <RMBTooltip
                      theme="highlight"
                      trigger={["focus"]}
                      overlay={
                        <PasswordOverlay
                          rules={this.props.rules}
                          password={values.password}
                          errors={errors.password}
                          theme="highlight"
                        />
                      }
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
                  </FormField>
                </div>
                <div className={AccountForm.fieldClass}>
                  <FormField
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
                  </FormField>
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
