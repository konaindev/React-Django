import React from "react";
import { Formik, Form } from "formik";
import Button from "../button";
import Checkbox from "../checkbox";
import Input from "../input";
import "./login.scss";
import Yup from "../../yup";
import { connect } from "react-redux";
import { auth } from "../../redux_base/actions";

const LOGIN_ERROR_MSG =
  "Oops! There was a problem with your login info, please try again.";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email Address")
    .required("Required"),
  password: Yup.string().required("Password Required")
});

export class LoginView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.formik = React.createRef();
    this.initialValues = {
      email: "",
      password: "",
      remember: false
    };
  }

  getErrorMessages = (errors, touched) => {
    let messages = [];
    const { loginError } = this.props;
    if (errors.email && touched.email) {
      messages.push(errors.email);
    }
    if (errors.password && touched.password) {
      messages.push(errors.password);
    }
    if (loginError) {
      messages.push(LOGIN_ERROR_MSG);
    }
    return (
      <p>
        {messages.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </p>
    );
  };

  getFieldMessage = props => {
    if (props.next) {
      if (props.authenticated) {
        return (
          <p>
            Your account doesn't have access to this page. To proceed, please
            login with an account that has access.
          </p>
        );
      } else {
        return <p>Please login to see this page.</p>;
      }
    }
  };

  onRemember = () => {
    const context = this.formik.current.getFormikContext();
    const value = context?.values?.remember;
    this.formik.current.setFieldValue("remember", !value);
  };

  onSubmit = (values, actions) => {
    actions.setSubmitting(false);
    // Some logic to process the values once middleware is built out
    this.props.dispatch(
      auth.login({ email: values.email, password: values.password })
    );
  };

  render() {
    return (
      <div className="auth-form">
        <div className="auth-form__content">
          <div className="auth-form__content-inner">
            <div className="auth-form__logo-wrap">
              <div className="remarkably-logo">&nbsp;</div>
            </div>
            <Formik
              onSubmit={this.onSubmit}
              initialValues={this.initialValues}
              validationSchema={LoginSchema}
              ref={this.formik}
            >
              {({
                errors,
                values,
                touched,
                handleSubmit,
                handleChange,
                handleBlur
              }) => (
                <Form method="post" onSubmit={handleSubmit}>
                  <div className="auth-form__messages">
                    {this.getFieldMessage(this.props)}
                    {this.getErrorMessages(errors, touched)}
                  </div>
                  <div className="auth-form__fields">
                    <div className="auth-form__field">
                      <div className="auth-form__field label">Email</div>
                      <Input
                        className="auth-form__field input"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className="auth-form__field">
                      <div className="auth-form__field label">Password</div>
                      <Input
                        className="auth-form__field input"
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className="auth-form__actions">
                      <Button
                        className="button--block button--uppercase"
                        color="primary"
                        type="submit"
                      >
                        LOG IN
                      </Button>
                    </div>
                  </div>
                  <div className="auth-form__extras">
                    <Checkbox
                      className="auth-form__checkbox"
                      isSelected={values.remember}
                      onClick={this.onRemember}
                    />
                    <input
                      type="checkbox"
                      name="remember"
                      hidden={true}
                      checked={values.remember}
                      readOnly={true}
                    />
                    <span>Remember Me?</span>
                    <div className="auth-form__extras break"></div>
                    <p>
                      <a href="/users/password-reset/">
                        Never set a password? Or forgot it?
                      </a>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="auth-form__side">
          <div className="auth-form__side-bg">
            <footer className="auth-form content-footer">
              <div className="copyright">
                <p>&copy; 2019 Remarkably. All Rights Reserved</p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  loginError: state.user.error
});

export default connect(mapState)(LoginView);
