import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Form, Formik } from "formik";

import { validatePassword } from "../../api/password";
import { getEmail } from "../../api/account_settings";
import AccountForm from "../account_form";
import Button from "../button";
import Input from "../input";
import FormField from "../form_field";
import PageAuth from "../page_auth";
import PasswordOverlay from "../password_tooltip";
import RMBTooltip from "../rmb_tooltip";
import { createPassword } from "../../redux_base/actions";
import "./create_password_view.scss";

export class CreatePasswordView extends React.PureComponent {
  static propTypes = {
    hash: PropTypes.string,
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired
      })
    ),
    back_link: PropTypes.string,
    validate: PropTypes.func
  };

  static defaultProps = {
    back_link: "/",
    validate: validatePassword
  };

  constructor(props) {
    super(props);
    this.state = {
      isCreateForm: true,
      email: ""
    };
  }

  async componentDidMount() {
    const {
      params: { uid, token }
    } = this.props.match;
    const user_id = this.props.hash;
    const userId = user_id ? this.props.hash : uid;

    if (uid && token) {
      this.setState({ isCreateForm: false });
    }
    try {
      const email = await getEmail(userId);
      this.setState({ email });
    } catch (error) {
      console.log(error);
    }
  }

  timeoutId;

  steps = [
    { name: "Set Password", isActive: true },
    { name: "Complete Account" }
  ];

  errorMessages = {
    password_1: "Not strong enough",
    password_2: "Passwords must match"
  };

  validate = values =>
    new Promise(res => {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => res(), 300);
    }).then(() => {
      const userId = this.props.hash
        ? this.props.hash
        : this.props.match.params.uid;
      return this.props.validate(values.password_1, userId).then(fieldError => {
        let errors = {};
        if (Object.keys(fieldError).length) {
          errors.rules_validation = fieldError;
          errors.password_1 = this.errorMessages.password_1;
        }
        if (!values.password_2 || values.password_2 !== values.password_1) {
          errors.password_2 = this.errorMessages.password_2;
        }
        if (Object.keys(errors).length) {
          throw errors;
        }
      });
    });

  getButtonColor = isValid => {
    if (isValid) {
      return "primary";
    }
    return "disabled-light";
  };

  onSubmit = (values, actions) => {
    const {
      params: { uid, token }
    } = this.props.match;

    if (this.state.isCreateForm) {
      this.props.dispatch(
        createPassword.setPassword({
          hash: this.props.hash,
          data: {
            password: values.password_1
          }
        })
      );
    } else {
      this.props.dispatch(
        createPassword.resetPassword({
          uid: uid,
          token: token,
          new_password1: values.password_1,
          new_password2: values.password_2
        })
      );
    }
  };

  render() {
    const { isCreateForm } = this.state;
    const titlePrefix = isCreateForm
      ? "Set your password"
      : "Reset my password";
    const subtitlePrefix = isCreateForm
      ? "Enter a password to gain access to your account."
      : "Enter your new password  to regain  entry.";
    return (
      <PageAuth backLink={this.props.back_link}>
        <div className="create-password">
          <AccountForm
            steps={isCreateForm ? this.steps : null}
            title={titlePrefix}
            subtitle={subtitlePrefix}
          >
            <Formik
              validate={this.validate}
              onSubmit={this.onSubmit}
              initialValues={{
                password_1: "",
                password_2: "",
                email: ""
              }}
            >
              {({
                errors,
                touched,
                values,
                isValid,
                handleChange,
                handleBlur,
                handleSubmit
              }) => (
                <Form method="post" onSubmit={handleSubmit}>
                  <div className={AccountForm.fieldClass}>
                    <FormField label="Your email">
                      <Input
                        type="input"
                        name="email"
                        theme="highlight"
                        value={this.state.email}
                        disabled
                      />
                    </FormField>
                  </div>
                  <div className={AccountForm.fieldClass}>
                    <FormField
                      label="Password"
                      error={errors.password_1}
                      showError={touched.password_1 && !!values.password_1}
                    >
                      <RMBTooltip
                        theme="highlight"
                        trigger={["focus"]}
                        overlay={
                          <PasswordOverlay
                            rules={this.props.rules}
                            password={values.password_1}
                            errors={errors.rules_validation}
                            theme="highlight"
                          />
                        }
                      >
                        <Input
                          type="password"
                          name="password_1"
                          theme="highlight"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password_1}
                        />
                      </RMBTooltip>
                    </FormField>
                  </div>
                  <div className={AccountForm.fieldClass}>
                    <FormField
                      label="Confirm Password"
                      error={errors.password_2}
                      showError={touched.password_2 && !!values.password_1}
                    >
                      <Input
                        type="password"
                        name="password_2"
                        theme="highlight"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password_2}
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
