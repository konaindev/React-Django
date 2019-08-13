import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Formik, Form } from "formik";

import AccountForm from "../account_form";
import Button from "../button";
import Input from "../input";
import FormField from "../form_field";
import PageAuth from "../page_auth";
import PasswordOverlay from "../password_tooltip";
import RMBTooltip from "../rmb_tooltip";
import router from "../../router";
import { post } from "../../utils/api";

import "./create_password_view.scss";

const validatePassword = (url, password, hash) =>
  post(url, { password, hash }).then(response => response.data.errors);

class CreatePasswordView extends React.PureComponent {
  static propTypes = {
    hash: PropTypes.string.isRequired,
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired
      })
    ).isRequired,
    back_link: PropTypes.string,
    validate: PropTypes.func,
    validate_url: PropTypes.string
  };

  static defaultProps = {
    back_link: "/",
    validate_url: "users/validate_password",
    validate: validatePassword
  };

  constructor(props) {
    super(props);
    this._router = router("/users")(hash =>
      props.dispatch({
        type: "API_CREATE_PASSWORD",
        hash
      })
    );
  }

  timeoutId;

  steps = [
    { name: "Set Password", isActive: true },
    { name: "Complete Account" }
  ];

  validate = values =>
    new Promise(res => {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => res(), 300);
    }).then(() =>
      this.props
        .validate(this.props.validate_url, values.password, this.props.hash)
        .then(fieldError => {
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
        })
    );

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
      <PageAuth backLink={this.props.back_link}>
        <div className="create-password">
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
                handleBlur,
                handleSubmit
              }) => (
                <Form
                  className="create-password__form"
                  method="post"
                  onSubmit={handleSubmit}
                >
                  <div className="create-password__field">
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
                  <div className="create-password__field">
                    <FormField
                      label="Confirm Password"
                      error={errors.password2}
                      showError={touched.password2 && !!values.password}
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
        </div>
      </PageAuth>
    );
  }
}

const mapState = state => ({
  ...state.createPassword
});

export default connect(mapState)(CreatePasswordView);
